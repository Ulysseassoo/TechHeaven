import request from 'supertest';
import * as dotenv from "dotenv";
import express from 'express';
import AddressRoutes from '../src/routes/addresses.mjs';
import { db } from '../src/utils/db.server.mjs';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api', AddressRoutes);


jest.mock('../src/middlewares/authentication.mjs', () => ({
  shouldBeAdmin: (req, res, next) => next(),
  shouldBeAuthenticate: (req, res, next) => {
    req.user = { id: 'user123', role: 'ROLE_ADMIN' }; // ou ROLE_ADMIN 
    next();
  }
}));

describe('Addresses API', () => {
  beforeAll(async () => {
    await db.$connect(); 
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it('should get addresses', async () => {
    const response = await request(app)
      .get('/api/addresses')
      .query({ page: 1, limit: 10, search: '' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('totalCount');
    expect(response.body).toHaveProperty('totalPages');
    expect(response.body).toHaveProperty('currentPage', 1);
  });

  it('should create a new address', async () => {
    const newAddress = {
      city: 'San Francisco',
      country: 'US',
      postal_code: '94117',
      address: '789 New St',
      is_selected: false,
      other: 'Other info',
      user_id: 'user123'
    };

    const response = await request(app)
      .post('/api/addresses')
      .send(newAddress);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('id');
  });

  it('should get a single address by ID', async () => {
    const response = await request(app)
      .get('/api/addresses/1');

    if (response.status === 404) {
      expect(response.body).toHaveProperty('message', 'Address not found');
    } else {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    }
  });

  it('should update an address by ID', async () => {
    const updatedAddress = {
      city: 'New City',
      country: 'US',
      postal_code: '94117',
      address: '123 Updated St',
      is_selected: true,
      other: 'Updated info'
    };

    const response = await request(app)
      .put('/api/addresses/1')
      .send(updatedAddress);

    if (response.status === 404) {
      expect(response.body).toHaveProperty('message', 'Address not found');
    } else {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    }
  });

  it('should delete an address by ID', async () => {
    const response = await request(app)
      .delete('/api/addresses/1');

    if (response.status === 404) {
      expect(response.body).toHaveProperty('message', 'Addresse introuvable');
    } else {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Addresse supprimé avec succès');
    }
  });
});
