import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
import Stripe from 'stripe';
import { sendInvoiceEmail } from '../src/utils/mailer.mjs';
import Invoice from '../src/models/Invoice.mjs';
import User from '../src/models/User.mjs';
import Product from '../src/models/Product.mjs';
import invoiceRouter from '../src/routes/invoice.mjs';

// Configuration du serveur de test
const app = express();
app.use(express.json());
app.use('/api', invoiceRouter);

// Mock des modules avec Jest
jest.mock('stripe');
jest.mock('../src/utils/mailer.mjs');
jest.mock('../src/models/User.mjs');
jest.mock('../src/models/Product.mjs');
jest.mock('../src/models/Invoice.mjs');
jest.mock('pdfkit');


const mockStripe = {
  paymentIntents: {
    create: jest.fn().mockResolvedValue({ client_secret: 'secret' })
  }
};
Stripe.mockImplementation(() => mockStripe);


const fakeUser = { _id: 'user123', email: 'user@example.com' };
const fakeProduct = { _id: 'product123', price: 100 };
const fakeInvoice = {
  _id: 'invoice123',
  userId: fakeUser._id,
  productId: fakeProduct._id,
  amount: 100,
  status: 'pending',
  toClient: () => ({ _id: 'invoice123' })
};

User.findById.mockResolvedValue(fakeUser);
Product.findById.mockResolvedValue(fakeProduct);
Invoice.findById.mockResolvedValue(fakeInvoice);
Invoice.prototype.save.mockResolvedValue(fakeInvoice);
sendInvoiceEmail.mockResolvedValue();
PDFDocument.prototype.end.mockImplementation(function() { return this; });


describe('Invoice API', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  

  it('should create a new invoice', async () => {
    const response = await request(app)
        .post('/invoices')
        .send(fakeInvoice);

    if (response.status !== 201) {
        console.error(response.body);
    }

    expect(response.status).toBe(201);
    expect(response.body.data._id).toBe(fakeInvoice._id.toString());
  });

  it('should generate PDF for an invoice', async () => {

    PDFDocument.prototype.end.mockImplementation(function() { return this; });

    const response = await request(app)
        .get(`/invoices/${fakeInvoice._id}/pdf`);

    if (response.status !== 200) {
        console.error(response.body);
    }

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');
  });

  it('should send invoice email', async () => {
    const response = await request(app)
    .post(`/invoices/${fakeInvoice._id}/email`);

    if (response.status !== 200) {
        console.error(response.body);
    }

    expect(response.status).toBe(200);
    expect(sendInvoiceEmail).toHaveBeenCalledTimes(1);
  });

  it('should create a payment intent', async () => {
    const response = await request(app)
        .post(`/payments/intent`)
        .send({ invoiceId: fakeInvoice._id });

    if (response.status !== 201) {
        console.error(response.body);
    }

    expect(response.status).toBe(201);
    expect(response.body.clientSecret).toBe('secret');
  });

  it('should generate a payment link', async () => {
    const response = await request(app)
        .post(`/payments/link`)
        .send({ invoiceId: fakeInvoice._id });

    if (response.status !== 200) {
        console.error(response.body);
    }

    expect(response.status).toBe(200);
    expect(response.body.paymentLink).toBeDefined();
  });

  it('should handle successful payment', async () => {
    const response = await request(app)
        .post(`/payments/success`)
        .send({ invoiceId: fakeInvoice._id });

    if (response.status !== 200) {
        console.error(response.body);
    }

    expect(response.status).toBe(200);
    expect(response.text).toBe('Paiement réussi !');
  });

  it('should handle payment cancellation', async () => {
    const response = await request(app)
      .get('/api/cancel');

    if (response.status !== 200) {
      console.error(response.body);
    }
    expect(response.status).toBe(200);
    expect(response.text).toBe('Paiement annulé.');
  });

  it('should create a payment intent for refunds', async () => {
    const response = await request(app)
    .post(`/payments/refund-intent`)
    .send({ invoiceId: fakeInvoice._id });

    if (response.status !== 200) {
        console.error(response.body);
    }

    expect(response.status).toBe(200);
    expect(response.body.clientSecret).toBe('secret');
  });

  it('should process refunds', async () => {
    const response = await request(app)
        .post(`/payments/refund`)
        .send({ invoiceId: fakeInvoice._id });

    if (response.status !== 200) {
        console.error(response.body);
    }

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Remboursement effectué avec succès');
  });

  it('should handle webhook events', async () => {
    const response = await request(app)
        .post(`/webhooks`)
        .send({ type: 'payment_intent.succeeded', data: { object: { id: 'evt_1FbnPo2eZvKYlo2CYp1Vw0tt' } } });

    if (response.status !== 200) {
        console.error(response.body);
    }

    expect(response.status).toBe(200);
  });
});
