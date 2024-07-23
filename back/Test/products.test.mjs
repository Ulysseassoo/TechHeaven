import request from 'supertest';
import express from 'express';
import * as dotenv from 'dotenv';
import ProductRoutes from '../src/routes/product.mjs';
import { db } from '../src/utils/db.server.mjs';
import Product from '../src/models/Product.mjs';

jest.mock('../src/utils/db.server.mjs', () => ({
  db: {
    product: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    }
  }
}));

jest.mock('../src/models/Product.mjs');

jest.mock('../src/middlewares/authentication.mjs', () => ({
  shouldBeAdmin: (req, res, next) => next(),
  shouldBeAuthenticate: (req, res, next) => {
    req.user = { id: 'user123', role: 'ROLE_ADMIN' };
    next();
  }
}));

dotenv.config();
const app = express();
app.use(express.json());
app.use(ProductRoutes);

describe('Product Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new product', async () => {
    const mockProductInput = { name: 'Test Product', description: 'Test Description', price: 100, stock_quantity: 10, brand: 'Test Brand' };
    const mockProduct = { id: '1', ...mockProductInput };
    db.product.create.mockResolvedValue(mockProduct);

    const res = await request(app)
      .post('/products')
      .send(mockProductInput)
      .expect(201);

    expect(res.body).toEqual({ status: 201, data: mockProduct });
    expect(db.product.create).toHaveBeenCalledWith({ data: mockProductInput });
  });

  it('should get all products', async () => {
    const mockProducts = [{ id: '1', name: 'Test Product', description: 'Test Description', price: 100, stock_quantity: 10, brand: 'Test Brand' }];
    Product.findToClient.mockResolvedValue(mockProducts);

    const res = await request(app)
      .get('/products')
      .expect(200);

    expect(res.body).toEqual({ status: 200, data: mockProducts });
    expect(Product.findToClient).toHaveBeenCalledWith({});
  });

  it('should get a product by ID', async () => {
    const mockProduct = { id: '1', name: 'Test Product', description: 'Test Description', price: 100, stock_quantity: 10, brand: 'Test Brand' };
    Product.findOne.mockResolvedValue(mockProduct);

    const res = await request(app)
      .get('/products/1')
      .expect(200);

    expect(res.body).toEqual({ status: 200, data: mockProduct });
    expect(Product.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should update a product', async () => {
    const mockProductInput = { name: 'Updated Product', description: 'Updated Description', price: 150, stock_quantity: 20, brand: 'Updated Brand' };
    const mockProduct = { id: '1', ...mockProductInput };
    db.product.update.mockResolvedValue(mockProduct);

    const res = await request(app)
      .put('/products/1')
      .send(mockProductInput)
      .expect(200);

    expect(res.body).toEqual({ status: 200, data: mockProduct });
    expect(db.product.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: mockProductInput
    });
  });

  it('should delete a product', async () => {
    db.product.delete.mockResolvedValue({});

    const res = await request(app)
      .delete('/products/1')
      .expect(200);

    expect(res.body).toEqual({ status: 200, message: 'Produit supprimé avec succès' });
    expect(db.product.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
