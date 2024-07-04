import express from 'express';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { db } from '../utils/db.server.mjs';
import { sendInvoiceEmail } from '../utils/mailer.mjs';
import Invoice from '../models/Invoice.mjs';
import User from '../models/User.mjs';
import Product from '../models/Product.mjs';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import dotenv from "dotenv";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in the environment variables');
}

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



// Créer une nouvelle facture
router.post('/invoices', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    const user = await User.findById(userObjectId);
    const product = await Product.findById(productObjectId);

    if (!user) {
      return res.status(404).json({ status: 404, message: "Utilisateur non trouvé" });
    }

    if (!product) {
      return res.status(404).json({ status: 404, message: "Produit non trouvé" });
    }

    const amount = product.price * quantity;

    // Utiliser Mongoose pour créer la facture
    const invoice = new Invoice({
      userId: userObjectId,
      productId: productObjectId,
      amount,
      status: 'pending'
    });

    await invoice.save();

    return res.status(201).json({ status: 201, data: invoice.toClient() });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Erreur lors de la création de la facture", error: error.message });
  }
});

// Générer le PDF de la facture
router.get('/invoices/:id/pdf', async (req, res) => {
  try {
      const { id } = req.params;

      const invoice = await db.invoice.findUnique({
          where: { id: parseInt(id) },
          include: { user: true, product: true }
      });

      if (!invoice) {
          return res.status(404).json({ status: 404, message: "Facture non trouvée" });
      }

      // Générer le PDF
      const doc = new PDFDocument();
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
          let pdfData = Buffer.concat(buffers);
          res.writeHead(200, {
              'Content-Length': Buffer.byteLength(pdfData),
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment;filename=invoice_${id}.pdf`,
          }).end(pdfData);
      });

      doc.fontSize(25).text(`Facture ${id}`, { align: 'center' });
      doc.fontSize(18).text(`Utilisateur: ${invoice.user.email}`);
      doc.text(`Produit: ${invoice.product.name}`);
      doc.text(`Quantité: ${invoice.quantity}`);
      doc.text(`Montant: ${invoice.amount} EUR`);
      doc.text(`Status: ${invoice.status}`);
      doc.end();
  } catch (error) {
      return res.status(500).json({ status: 500, message: "Erreur lors de la génération du PDF", error: error.message });
  }
});

// Envoyer la facture par email
router.post('/invoices/:invoiceId/email', async (req, res) => {
  try {
      const invoiceId = parseInt(req.params.invoiceId, 10);
      const invoice = await db.invoice.findUnique({
          where: { id: invoiceId },
          include: { user: true },
      });

      if (!invoice) {
          return res.status(404).json({ status: 404, message: 'Invoice not found' });
      }

      await sendInvoiceEmail(invoice.user.email, invoice);

      res.status(200).json({ status: 200, message: 'Invoice email sent successfully' });
  } catch (error) {
      res.status(500).json({ status: 500, message: 'Error sending invoice email', error: error.message });
  }
});

router.post("/invoices/:invoiceId/pay", async (req, res) => {
  const { invoiceId } = req.params;

  try {

    const invoiceObjectId = new mongoose.Types.ObjectId(invoiceId);

    const invoice = await Invoice.findById(invoiceObjectId);

    if (!invoice) {
      return res.status(404).json({ message: "Facture non trouvée" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: invoice.amount * 100, // montant en centimes
      currency: "eur",
      metadata: { invoiceId: invoice.id },
    });

    return res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de l'initiation du paiement", error: error.message });
  }
});

// Endpoint pour générer un lien de paiement
const generatePaymentLink = async (invoiceId, amount) => {
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: 'eur',
        product_data: {
          name: `Facture ${invoiceId}`
        },
        unit_amount: amount * 100 // Montant en centimes
      },
      quantity: 1
    }
  ],
  mode: 'payment',
  success_url: `http://localhost:8000/api/success/${invoiceId}`, // A changer au moment de la prod les gars ! 
  cancel_url: `http://localhost:8000/cancel`// A changer au moment de la prod les gars ! 
});

return session.url;
};

router.post("/invoices/:invoiceId/paylink", async (req, res) => {
  const { invoiceId } = req.params;

  try {
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Facture non trouvée" });
    }

    const paymentLink = await generatePaymentLink(invoice._id.toString(), invoice.amount);

    return res.status(200).json({ paymentLink });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la génération du lien de paiement", error: error.message });
  }
});

router.get('/success/:invoiceId', async (req, res) => {
  const { invoiceId } = req.params;
  console.log(invoiceId);

  try {
    // Mettez à jour le statut de la facture à "paid" dans la base de données
    const updatedInvoice = await Invoice.findByIdAndUpdate(invoiceId, { status: 'paid' }, { new: true });

    if (!updatedInvoice) {
      return res.status(404).send('Facture non trouvée');
    }

    res.send('Paiement réussi !');
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la facture: ${error.message}`);
    res.status(500).send(`Erreur lors de la mise à jour de la facture: ${error.message}`);
  }
});


router.get('/cancel', (req, res) => {
  res.send('Paiement annulé.');
});



/////// Générer l'ID de la colonne paymentIntentID pour accéder au Refund /////////

router.post('/create-payment-intent', async (req, res) => {
  const { invoiceId } = req.body;

  try {
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).send({ message: 'Facture non trouvée' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: invoice.amount * 100,
      currency: 'eur',
      metadata: { invoiceId: invoice.id },
    });

    invoice.paymentIntentId = paymentIntent.id;
    await invoice.save();

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la création du paiement', error: error.message });
  }
});
  

/// Remboursement 
router.post('/refund', async (req, res) => {
  const { paymentIntentId, invoiceId } = req.body;

  try {
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      console.log('Facture non trouvée');
      return res.status(404).send({ message: 'Facture non trouvée' });
    }

    if (invoice.status !== 'paid') {
      console.log("La facture n'a pas encore été payée, impossible de rembourser.");
      return res.status(400).send({ message: "La facture n'a pas encore été payée, impossible de rembourser." });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      console.log('Impossible de récupérer le PaymentIntent.');
      return res.status(400).send({ message: "Impossible de récupérer le PaymentIntent." });
    }

    console.log('PaymentIntent:', paymentIntent);

    if (paymentIntent.status !== 'succeeded') {
      console.log("Le PaymentIntent n'a pas réussi.");
      return res.status(400).send({ message: "Le PaymentIntent n'a pas réussi." });
    }

    if (!paymentIntent.charges.data.length) {
      console.log('Le PaymentIntent ne contient pas de charges.');
      return res.status(400).send({ message: "Le PaymentIntent ne contient pas de charges." });
    }

    const chargeId = paymentIntent.charges.data[0].id;

    console.log('Charge ID:', chargeId);

    const refund = await stripe.refunds.create({ charge: chargeId });

    invoice.status = 'refunded';
    await invoice.save();

    res.status(200).send({ message: 'Remboursement effectué avec succès', refund });
  } catch (error) {
    console.log('Erreur lors du remboursement:', error.message);
    res.status(500).send({ message: 'Erreur lors du remboursement', error: error.message });
  }
});




router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
const sig = req.headers['stripe-signature'];
let event;

try {
  const rawBody = req.body.toString();
  event = JSON.parse(rawBody);
} catch (err) {
  console.error(`Webhook Error: ${err.message}`);
  return res.status(400).send(`Webhook Error: ${err.message}`);
}

// Gérer l'événement de paiement réussi
if (event.type === 'payment_intent.succeeded') {
  const paymentIntent = event.data.object;
  const invoiceId = paymentIntent.metadata.invoiceId;

  try {
    const invoice = await db.invoice.update({
      where: { id: parseInt(invoiceId) },
      data: { status: 'paid' },
    });

    // Envoyer la facture par email
    await sendInvoiceEmail(invoice.userEmail, invoice);

    console.log(`Facture ${invoiceId} marquée comme payée.`);
    return res.status(200).send({ received: true });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la facture ${invoiceId}: ${error.message}`);
    return res.status(500).send({ error: error.message });
  }
}

// Gérer l'événement de paiement échoué
if (event.type === 'payment_intent.payment_failed') {
  const paymentIntent = event.data.object;
  const invoiceId = paymentIntent.metadata.invoiceId;

  try {
    await db.invoice.update({
      where: { id: parseInt(invoiceId) },
      data: { status: 'failed' },
    });

    console.log(`Facture ${invoiceId} marquée comme échouée.`);
    return res.status(200).send({ received: true });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la facture ${invoiceId}: ${error.message}`);
    return res.status(500).send({ error: error.message });
  }
}

res.status(200).send({ received: true });
});



export default router;