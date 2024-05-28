import express from 'express';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { db } from '../utils/db.server.mjs';

const router = express.Router();

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



//////////////////////////////////////////////////////////
/* Revoir la partie SEND MAIL problème de config google !! 
//////////////////////////////////////////////////////////

// Envoyer la facture par email
router.post('/invoices/:id/email', async (req, res) => {
    try {
        const { id } = req.params;

        // Récupérer la facture
        const invoice = await db.invoice.findUnique({
            where: { id: parseInt(id) },
            include: { user: true, product: true }
        });

        if (!invoice) {
            return res.status(404).json({ status: 404, message: "Facture non trouvée" });
        }

        // Configurer Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jphayek@yopmail.com',
                pass: 'Jphayek123456@'
            }
        });

        // Générer le PDF
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            let pdfData = Buffer.concat(buffers);

            // Envoyer l'email avec la pièce jointe PDF
            const mailOptions = {
                from: 'jphayek@yopmail.com',
                to: invoice.user.email,
                subject: `Facture ${id}`,
                text: `Bonjour, veuillez trouver ci-joint la facture ${id}.`,
                attachments: [{
                    filename: `invoice_${id}.pdf`,
                    content: pdfData
                }]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ status: 500, message: "Erreur lors de l'envoi de l'email", error: error.message });
                } else {
                    return res.status(200).json({ status: 200, message: "Email envoyé avec succès", info });
                }
            });
        });

        doc.fontSize(25).text(`Facture ${id}`, { align: 'center' });
        doc.fontSize(18).text(`Utilisateur: ${invoice.user.email}`);
        doc.text(`Produit: ${invoice.product.name}`);
        doc.text(`Quantité: ${invoice.quantity}`);
        doc.text(`Montant: ${invoice.amount} EUR`);
        doc.text(`Status: ${invoice.status}`);
        doc.end();
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Erreur lors de l'envoi de la facture par email", error: error.message });
    }
});


*/

export default router;