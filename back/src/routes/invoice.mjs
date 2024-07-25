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
import { shouldBeAuthenticate } from '../middlewares/authentication.mjs';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in the environment variables');
}

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



router.post('/invoices/:orderId', shouldBeAuthenticate ,async (req, res) => {
  try {
    const user = req.user
    const { orderId } = req.params

    const order = await db.order.findUnique({
      where: {
        id: orderId
      }
    })

    if (order.user_id !== user.id) {
      return res.status(401).send({
        status: 401,
        message: "Vous n'avez pas les droits",
    });
    }

    const products = await db.orderDetail.findMany({
      where: {
        order_id: orderId
      }
    })

    if (!products) {
      return res.status(400).send({
        status: 400,
        message: "Produits inexistants.",
      });
    }

    const invoice = await db.invoice.create({
      data: {
        user_id: user.id,
        order_id: orderId,
        user_firstname: user.firstname,
        user_lastname: user.lastname,
        amount: order.total_amount
      }
    })

    await Promise.all(products.map(async (product) => {
      await db.invoiceDetail.create({
          data: {
              quantity: product.quantity,
              product_name: product.product_name,
              product_description: product.product_description,
              unit_price: parseInt(product.unit_price),
              invoice_id: invoice.id,
              product_id: product.id,
          }
      });
  }));

  return res.status(201).json({ status: 201, data: invoice });

  } catch (error) {
    return res.status(500).json({ status: 500, message: "Erreur lors de la création de la facture", error: error.message });
  }
});

// Générer le PDF de la facture
// router.get('/invoices/:id/pdf', async (req, res) => {
//   try {
//       const { id } = req.params;

//       const invoice = await db.invoice.findUnique({
//           where: { id: parseInt(id) },
//           include: { user: true, product: true }
//       });

//       if (!invoice) {
//           return res.status(404).json({ status: 404, message: "Facture non trouvée" });
//       }

//       // Générer le PDF
//       const doc = new PDFDocument();
//       let buffers = [];
//       doc.on('data', buffers.push.bind(buffers));
//       doc.on('end', () => {
//           let pdfData = Buffer.concat(buffers);
//           res.writeHead(200, {
//               'Content-Length': Buffer.byteLength(pdfData),
//               'Content-Type': 'application/pdf',
//               'Content-Disposition': `attachment;filename=invoice_${id}.pdf`,
//           }).end(pdfData);
//       });

//       doc.fontSize(25).text(`Facture ${id}`, { align: 'center' });
//       doc.fontSize(18).text(`Utilisateur: ${invoice.user.email}`);
//       doc.text(`Produit: ${invoice.product.name}`);
//       doc.text(`Quantité: ${invoice.quantity}`);
//       doc.text(`Montant: ${invoice.amount} EUR`);
//       doc.text(`Status: ${invoice.status}`);
//       doc.end();
//   } catch (error) {
//       return res.status(500).json({ status: 500, message: "Erreur lors de la génération du PDF", error: error.message });
//   }
// });

// // Envoyer la facture par email
// router.post('/invoices/:invoiceId/email', async (req, res) => {
//   try {
//       const invoiceId = parseInt(req.params.invoiceId, 10);
//       const invoice = await db.invoice.findUnique({
//           where: { id: invoiceId },
//           include: { user: true },
//       });

//       if (!invoice) {
//           return res.status(404).json({ status: 404, message: 'Invoice not found' });
//       }

//       await sendInvoiceEmail(invoice.user.email, invoice);

//       res.status(200).json({ status: 200, message: 'Invoice email sent successfully' });
//   } catch (error) {
//       res.status(500).json({ status: 500, message: 'Error sending invoice email', error: error.message });
//   }
// });

// router.post("/invoices/:invoiceId/pay", async (req, res) => {
//   const { invoiceId } = req.params;

//   try {

//     const invoiceObjectId = new mongoose.Types.ObjectId(invoiceId);

//     const invoice = await Invoice.findById(invoiceObjectId);

//     if (!invoice) {
//       return res.status(404).json({ message: "Facture non trouvée" });
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: invoice.amount * 100, // montant en centimes
//       currency: "eur",
//       metadata: { invoiceId: invoice.id },
//     });

//     return res.status(201).json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     return res.status(500).json({ message: "Erreur lors de l'initiation du paiement", error: error.message });
//   }
// });

// /////// Générer l'ID de la colonne paymentIntentID pour accéder au Refund /////////

// router.post('/create-payment-intent', async (req, res) => {
//   const { invoiceId } = req.body;

//   try {
//     const invoice = await Invoice.findById(invoiceId);

//     if (!invoice) {
//       return res.status(404).send({ message: 'Facture non trouvée' });
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: invoice.amount * 100,
//       currency: 'eur',
//       payment_method_types: ['card'],
//       metadata: { invoiceId: invoice.id },
//     });

//     invoice.paymentIntentId = paymentIntent.id;
//     await invoice.save();

//     res.send({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     res.status(500).send({ message: 'Erreur lors de la création du paiement', error: error.message });
//   }
// });
  

// /// Remboursement 
// router.post('/refund', async (req, res) => {
//   const { paymentIntentId, invoiceId } = req.body;

//   try {
//     const invoice = await Invoice.findById(invoiceId);

//     if (!invoice) {
//       console.log('Facture non trouvée');
//       return res.status(404).send({ message: 'Facture non trouvée' });
//     }

//     if (invoice.status !== 'paid') {
//       console.log("La facture n'a pas encore été payée, impossible de rembourser.");
//       return res.status(400).send({ message: "La facture n'a pas encore été payée, impossible de rembourser." });
//     }

//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     if (!paymentIntent) {
//       console.log('Impossible de récupérer le PaymentIntent.');
//       return res.status(400).send({ message: "Impossible de récupérer le PaymentIntent." });
//     }

//     console.log('PaymentIntent:', paymentIntent);

//     if (paymentIntent.status !== 'succeeded') {
//       console.log("Le PaymentIntent n'a pas réussi.");
//       return res.status(400).send({ message: "Le PaymentIntent n'a pas réussi." });
//     }

//     if (!paymentIntent.charges.data.length) {
//       console.log('Le PaymentIntent ne contient pas de charges.');
//       return res.status(400).send({ message: "Le PaymentIntent ne contient pas de charges." });
//     }

//     const chargeId = paymentIntent.charges.data[0].id;

//     console.log('Charge ID:', chargeId);

//     const refund = await stripe.refunds.create({ charge: chargeId });

//     invoice.status = 'refunded';
//     await invoice.save();

//     res.status(200).send({ message: 'Remboursement effectué avec succès', refund });
//   } catch (error) {
//     console.log('Erreur lors du remboursement:', error.message);
//     res.status(500).send({ message: 'Erreur lors du remboursement', error: error.message });
//   }
// });



// router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
//   const sig = req.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   } catch (err) {
//     console.error(`Webhook Error: ${err.message}`);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Gérer l'événement de paiement réussi
//   if (event.type === 'payment_intent.succeeded') {
//     const paymentIntent = event.data.object;
//     const invoiceId = paymentIntent.metadata.invoiceId;

//     try {
//       const invoice = await Invoice.findByIdAndUpdate(invoiceId, { status: 'paid' }, { new: true });

//       if (!invoice) {
//         return res.status(404).send('Facture non trouvée');
//       }

//       // Envoyer la facture par email
//       await sendInvoiceEmail(invoice.userEmail, invoice);

//       console.log(`Facture ${invoiceId} marquée comme payée.`);
//       return res.status(200).send({ received: true });
//     } catch (error) {
//       console.error(`Erreur lors de la mise à jour de la facture ${invoiceId}: ${error.message}`);
//       return res.status(500).send({ error: error.message });
//     }
//   }

//   // Gérer l'événement de paiement échoué
//   if (event.type === 'payment_intent.payment_failed') {
//     const paymentIntent = event.data.object;
//     const invoiceId = paymentIntent.metadata.invoiceId;

//     try {
//       await Invoice.findByIdAndUpdate(invoiceId, { status: 'failed' });

//       console.log(`Facture ${invoiceId} marquée comme échouée.`);
//       return res.status(200).send({ received: true });
//     } catch (error) {
//       console.error(`Erreur lors de la mise à jour de la facture ${invoiceId}: ${error.message}`);
//       return res.status(500).send({ error: error.message });
//     }
//   }

//   res.status(200).send({ received: true });
// });




export default router;