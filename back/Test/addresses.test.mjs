import request from 'supertest';
import * as dotenv from 'dotenv';
import express from 'express';
import AddressRoutes from '../src/routes/addresses.mjs';
import { db } from '../src/utils/db.server.mjs';
import User from '../src/models/User.mjs'; // Assurez-vous que ce chemin est correct
import { validationResult } from 'express-validator';

// Mock des dépendances
jest.mock('../src/utils/db.server.mjs', () => ({
  db: {
    address: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }
  }
}));

jest.mock('../src/middlewares/authentication.mjs', () => ({
  shouldBeAdmin: (req, res, next) => next(),
  shouldBeAuthenticate: (req, res, next) => {
    req.user = { id: 'user123', role: 'ROLE_ADMIN' }; 
    next();
  }
}));

jest.mock('../src/models/User.mjs', () => ({
  findAddresses: jest.fn(),
}));

dotenv.config();
const app = express();
app.use(express.json());
app.use(AddressRoutes);

describe('Address Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new address', async () => {
    const mockAddressInput = {
      city: 'New York',
      country: 'USA',
      postal_code: '10001',
      address: '123 Main St',
      is_selected: 'true',  // Assurez-vous que c'est un booléen
      other: 'Apt 4B',
      user_id: 'user123'
    };
    const mockAddress = { id: '1', ...mockAddressInput };
    db.address.create.mockResolvedValue({ id: '1', ...mockAddressInput });

    const res = await request(app)
      .post('/addresses')
      .send(mockAddressInput)
      .expect(201);

    expect(res.body).toEqual({ status: 201, data: mockAddress });
    expect(db.address.create).toHaveBeenCalledWith({
      data: expect.objectContaining(mockAddressInput)
    });
  });

  it('should get an address by ID', async () => {
    const mockAddress = { id: '1', city: 'New York', country: 'USA', postal_code: '10001', address: '123 Main St' };
    db.address.findUnique.mockResolvedValue(mockAddress);

    const res = await request(app)
      .get('/addresses/1')
      .expect(200);

    expect(res.body).toEqual({ status: 200, data: mockAddress });
    expect(db.address.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should get all addresses with query', async () => {
    const mockAddresses = [{ id: '1', city: 'New York', country: 'USA', postal_code: '10001', address: '123 Main St' }];
    const mockResponse = {
      addresses: mockAddresses,
      totalCount: 1,
      totalPages: 1
    };
    User.findAddresses.mockResolvedValue(mockResponse);

    const res = await request(app)
      .get('/addresses')
      .query({ search: 'New York', page: 1, limit: 10 })
      .expect(200);

    expect(res.body).toEqual({
      status: 200,
      currentPage: 1,
      totalCount: 1,
      totalPages: 1,
      data: mockAddresses
    });
    expect(User.findAddresses).toHaveBeenCalledWith({
      $or: [
        { 'addresses.address': { $regex: new RegExp('New York', 'i') } },
        { 'addresses.other': { $regex: new RegExp('New York', 'i') } },
        { 'addresses.city': { $regex: new RegExp('New York', 'i') } },
        { 'addresses.postal_code': { $regex: new RegExp('New York', 'i') } },
        { 'addresses.country': { $regex: new RegExp('New York', 'i') } },
        { 'firstname': { $regex: new RegExp('New York', 'i') } },
        { 'lastname': { $regex: new RegExp('New York', 'i') } }
      ],
    }, 1, 10);
  });

  it('should update an address', async () => {
    const mockAddressUpdate = {
      city: 'San Francisco',
      country: 'USA',
      postal_code: '94105',
      address: '456 Elm St',
      is_selected: false,
      other: 'Suite 300'
    };
    const mockAddress = { id: '1', ...mockAddressUpdate };
    db.address.findUnique.mockResolvedValue(mockAddress);
    db.address.update.mockResolvedValue(mockAddress);

    const res = await request(app)
      .put('/addresses/1')
      .send(mockAddressUpdate)
      .expect(200);

    expect(res.body).toEqual({ status: 200, data: mockAddress });
    expect(db.address.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: expect.objectContaining(mockAddressUpdate)
    });
  });

  it('should delete an address', async () => {
    db.address.findUnique.mockResolvedValue({ id: '1', user_id: 'user123' });
    db.address.delete.mockResolvedValue({ id: '1' });

    const res = await request(app)
      .delete('/addresses/1')
      .expect(200);

    expect(res.body).toEqual({ status: 200, message: 'Addresse supprimé avec succès' });
    expect(db.address.delete).toHaveBeenCalledWith({
      where: { id: '1' }
    });
  });

});
