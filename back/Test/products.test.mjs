import request from 'supertest';
import express from 'express';
import * as dotenv from "dotenv";
import ProductRoutes from '../src/routes/product.mjs';
import { db } from '../src/utils/db.server.mjs';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api', ProductRoutes);

beforeAll(async () => {
  await db.$connect();
});

afterAll(async () => {
  await db.$disconnect();
});

beforeEach(async () => {
  await db.product.deleteMany({});
});

describe('Products API', () => {
  //jest.setTimeout(5000); // Augmente le timeout à 10 secondes pour tous les tests

  it('should create a new product', async () => {
    jest.setTimeout(5000);
    const newProduct = { name: 'New Product', price: 100 };

  const response = await request(app)
    .post('/api/products')
    .send(newProduct);

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('data');
  expect(response.body.data).toHaveProperty('id');
  });

  it('should get all products', async () => {
    jest.setTimeout(5000);
    await db.product.create({
      data: {
        name: 'Existing Product',
        description: 'This product already exists.',
        price: 49.99,
        stock_quantity: 50,
        brand: 'BrandY'
      }
    });

    const response = await request(app)
      .get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('should get a product by ID', async () => {
    jest.setTimeout(5000);
    const product = await db.product.create({
      data: {
        name: 'Unique Product',
        description: 'This product is unique.',
        price: 19.99,
        stock_quantity: 10,
        brand: 'BrandZ'
      }
    });

    const response = await request(app)
      .get(`/api/products/${product.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('id', product.id);
  });

  it('should update a product by ID', async () => {
    jest.setTimeout(5000);
    const product = await db.product.create({
      data: {
        name: 'Product to Update',
        description: 'Product to be updated.',
        price: 39.99,
        stock_quantity: 30,
        brand: 'BrandA'
      }
    });

    const updatedProduct = {
      name: 'Updated Product',
      description: 'Updated description.',
      price: 59.99,
      stock_quantity: 20,
      brand: 'BrandB'
    };

    const response = await request(app)
      .put(`/api/products/${product.id}`)
      .set('Authorization', 'Bearer admin_token') 
      .send(updatedProduct);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('name', updatedProduct.name);
  });

  it('should delete a product by ID', async () => {
    jest.setTimeout(5000);
    const product = await db.product.create({
      data: {
        name: 'Product to Delete',
        description: 'Product to be deleted.',
        price: 89.99,
        stock_quantity: 5,
        brand: 'BrandC'
      }
    });

    const response = await request(app)
      .delete(`/api/products/${product.id}`)
      .set('Authorization', 'Bearer admin_token'); 

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Produit supprimé avec succès');

    const deletedProduct = await db.product.findUnique({
      where: { id: product.id }
    });
    expect(deletedProduct).toBeNull();
  });
});