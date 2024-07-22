import request from 'supertest';
import express from 'express';
import ProductRoutes from '../src/routes/product.mjs';
import { db } from '../src/utils/db.server.mjs';

const app = express();
app.use(express.json());
app.use('/api', ProductRoutes);

describe('Products API', () => {
  beforeAll(async () => {
    await db.$connect(); 
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  beforeEach(async () => {
    // Réinitialiser la base de données avant chaque test
    await db.product.deleteMany({});
  });

  it('should create a new product', async () => {
    const newProduct = {
      name: 'New Product',
      description: 'This is a new product.',
      price: 29.99,
      stock_quantity: 100,
      brand: 'BrandX'
    };

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', 'Bearer admin_token') 
      .send(newProduct);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('id');
  });

  it('should get all products', async () => {
    // Créer un produit pour vérifier
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

    // Vérifiez que le produit a été supprimé
    const deletedProduct = await db.product.findUnique({
      where: { id: product.id }
    });
    expect(deletedProduct).toBeNull();
  });
});
