import express from 'express';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { db } from '../utils/db.server.mjs';
import { sendInvoiceEmail } from '../utils/mailer.mjs';
import Stripe from 'stripe';
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
//const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // A revoir cette methode pour cacher le clé secrete
const stripe = new Stripe('sk_test_IWXNNdz4d5fdHLA362PzpJGS00G15qtESV');


// Créer une nouvelle facture
router.post('/invoices', async (req, res) => {
  try {
      const { userId, productId, quantity } = req.body;
      const user = await db.user.findUnique({ where: { id: userId } });
      const product = await db.product.findUnique({ where: { id: productId } });

      if (!user) {
          return res.status(404).json({ status: 404, message: "Utilisateur non trouvé" });
      }

      if (!product) {
          return res.status(404).json({ status: 404, message: "Produit non trouvé" });
      }


      const amount = product.price * quantity;

      const invoice = await db.invoice.create({
          data: {
              userId,
              productId,
              amount,
              status: 'pending'
          }
      });

      return res.status(201).json({ status: 201, data: invoice });
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

// Endpoint pour initier un paiement
router.post("/invoices/:invoiceId/pay", async (req, res) => {
const { invoiceId } = req.params;

try {
  const invoice = await db.invoice.findUnique({
    where: { id: parseInt(invoiceId) },
  });

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

router.get('/invoices/:invoiceId/payment-link', async (req, res) => {
const { invoiceId } = req.params;

try {
  const invoice = await db.invoice.findUnique({
    where: { id: parseInt(invoiceId) },
  });

  if (!invoice) {
    return res.status(404).json({ message: 'Facture non trouvée' });
  }

  const paymentLink = await generatePaymentLink(invoiceId, invoice.amount);
  res.status(201).json({ url: paymentLink });
} catch (error) {
  res.status(500).json({ message: "Erreur lors de la génération du lien de paiement", error: error.message });
}
});

router.get('/success/:invoiceId', async (req, res) => {
  
  const { invoiceId } = req.params;
  console.log(invoiceId)
  try {
    // Mettez à jour le statut de la facture à "paid" dans la base de données
    await db.invoice.update({
      where: { id: parseInt(invoiceId) },
      data: { status: 'paid' },
    });
    res.send('Paiement réussi !');
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la facture: ${error.message}`);
    res.status(500).send(`Erreur lors de la mise à jour de la facture: ${error.message}`);
  }
});



router.get('/cancel', (req, res) => {
  res.send('Paiement annulé.');
});
  

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
const sig = req.headers['stripe-signature'];
let event;

// Désactiver la validation de la signature pour les tests locaux
try {
  // Parse le corps brut de la requête pour obtenir l'objet JSON
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