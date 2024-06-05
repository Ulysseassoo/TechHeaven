import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoicePDF = (invoice) => {
    const doc = new PDFDocument();
    const filePath = path.resolve(__dirname, `../../invoices/invoice_${invoice.id}.pdf`);

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(25).text('Invoice', {
        align: 'center'
    });

    doc.text(`Invoice ID: ${invoice.id}`);
    doc.text(`User: ${invoice.user.firstname} ${invoice.user.lastname}`);
    doc.text(`Amount: ${invoice.amount}`);
    doc.text(`Date: ${invoice.createdAt}`);

    doc.end();

    return filePath;
}
