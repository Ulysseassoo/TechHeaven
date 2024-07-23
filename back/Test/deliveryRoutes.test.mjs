import request from 'supertest';
import express from 'express';
import * as dotenv from 'dotenv';
import { db } from '../src/utils/db.server.mjs';
import DeliveryRoutes from '../src/routes/deliveryRoutes.mjs';
import Delivery from '../src/models/Delivery.mjs';
import { shouldBeAuthenticate } from '../src/middlewares/authentication.mjs';


jest.mock('../src/models/Delivery.mjs');

jest.mock('../src/middlewares/authentication.mjs', () => ({
  shouldBeAuthenticate: (req, res, next) => next(),
}));

jest.mock('../src/utils/db.server.mjs', () => ({
  db: {
    delivery: {
      create: jest.fn(),
    },
  },
}));

dotenv.config();

const app = express();
app.use(express.json());
app.use(DeliveryRoutes);

describe('Delivery Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test pour ajouter une nouvelle livraison
  it('should add a new delivery', async () => {
    const mockDelivery = {
      address: '123 Main St',
      status: 'Pending',
      following_number: 'ABC123',
      delivered: false
    };
    const mockAddress = { id: '1', ...mockDelivery };
    db.delivery.create.mockResolvedValue({ id: '1', ...mockDelivery });

    const res = await request(app)
      .post('/deliveries')
      .send(mockDelivery)
      .expect(201);

    expect(res.body).toEqual(mockAddress);
    expect(db.delivery.create).toHaveBeenCalled();
  });

  // Test pour récupérer toutes les livraisons
  it('should get all deliveries', async () => {
    const mockDeliveries = [
      { address: '123 Main St', status: 'Pending', following_number: 'ABC123', delivered: false },
      { address: '456 Elm St', status: 'Shipped', following_number: 'DEF456', delivered: true }
    ];

    Delivery.find.mockResolvedValue(mockDeliveries);

    const res = await request(app)
      .get('/deliveries')
      .expect(200);

    expect(res.body).toEqual(mockDeliveries);
    expect(Delivery.find).toHaveBeenCalledWith({});
  });

  // Test pour mettre à jour une livraison
  it('should update delivery status', async () => {
    const deliveryId = '1';
    const mockDelivery = {
      _id: deliveryId,
      address: '123 Main St',
      status: 'Pending',
      following_number: 'ABC123',
      delivered: true
    };

    Delivery.findById.mockResolvedValue(mockDelivery);
    const saveMock = jest.fn().mockResolvedValue(mockDelivery);
    Delivery.prototype.save = saveMock;

    const res = await request(app)
      .patch(`/deliveries/${deliveryId}`)
      .send({ delivered: true })
      .expect(200);

    expect(res.body).toEqual(mockDelivery);
    expect(Delivery.findById).toHaveBeenCalledWith(deliveryId);
    expect(saveMock).toHaveBeenCalled();
  });
});
