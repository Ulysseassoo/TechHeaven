import express from 'express';
import request from 'supertest';
import { db } from '../src/utils/db.server.mjs';  // Assurez-vous que ce module est correctement exporté dans votre projet
import invoiceRouter from '../src/routes/invoice.mjs';

// Configuration du serveur de test
const app = express();
app.use(express.json());
app.use('/api', invoiceRouter);

jest.mock('../src/middlewares/authentication.mjs', () => ({
  shouldBeAuthenticate: (req, res, next) => {
    req.user = { id: 'user123', role: 'ROLE_ADMIN' };
    next();
  },
  shouldBeAdmin: (req, res, next) => next(),
  shouldBeAdminOrKeeper: (req, res, next) => next(),
}));
// Mock des modules avec Jest
jest.mock('../src/utils/db.server.mjs', () => ({
  db: {
    order: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    orderDetail: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    invoice: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('stripe');
jest.mock('../src/utils/mailer.mjs');
jest.mock('../src/models/User.mjs');
jest.mock('../src/models/Product.mjs');

// Configuration des données de test
describe('Invoice API', () => {
  let orderId = 'order123';
  let userId = 'user1';

  beforeAll(async () => {

    db.order.findUnique.mockResolvedValue({
      id: orderId,
      user_id: userId,
      total_amount: 1000,
    });

  
    db.invoice.create.mockResolvedValue({
      id: 'invoice123',
      user_id: userId,
      order_id: orderId,
      user_firstname: 'John',
      user_lastname: 'Doe',
      amount: 1000,
    });

  
    db.orderDetail.createMany.mockResolvedValue([]);
    db.orderDetail.findMany = jest.fn().mockResolvedValue([
      { order_id: orderId, product_name: 'Product1', product_description: 'Description1', quantity: 2, unit_price: 500, id: 'product1' },
      { order_id: orderId, product_name: 'Product2', product_description: 'Description2', quantity: 1, unit_price: 500, id: 'product2' }
    ]);
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  test('should create an invoice successfully', async () => {
    const response = await request(app)
      .post(`/api/invoices/${orderId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.user_id).toBe(userId);
    expect(response.body.data.order_id).toBe(orderId);
  });

  test('should return 401 if user does not own the order', async () => {
    jest.mock('../src/middlewares/authentication.mjs', () => ({
      shouldBeAuthenticate: (req, res, next) => {
        req.user = { id: 'differentUserId', firstname: 'Jane', lastname: 'Doe' };
        next();
      }
    }));

    const response = await request(app)
      .post(`/api/invoices/${orderId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body.status).toBe(401);
    expect(response.body.message).toBe("Vous n'avez pas les droits");
  });

  test('should return 400 if no products are found', async () => {
    db.orderDetail.findMany.mockResolvedValue([]);

    const response = await request(app)
      .post(`/api/invoices/${orderId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body.status).toBe(400);
    expect(response.body.message).toBe("Produits inexistants.");
  });

  test('should return 500 if there is an error creating the invoice', async () => {
    db.invoice.create.mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await request(app)
      .post(`/api/invoices/${orderId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500);

    expect(response.body.status).toBe(500);
    expect(response.body.message).toBe("Erreur lors de la création de la facture");
  });
});
