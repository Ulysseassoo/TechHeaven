import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = __filename;
const dirname = __dirname;

export const generateInvoicePDF = (invoice) => {
    const doc = new PDFDocument();
    const filePath = path.resolve(dirname, `../../invoices/invoice_${invoice.id}.pdf`);

    doc.pipe(fs.createWriteStream(filename));

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
