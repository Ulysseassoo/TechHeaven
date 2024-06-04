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

export default router;