import request from 'supertest';
import express from 'express';
import OrderRoutes from '../src/routes/order.mjs';
import Order from '../src/models/Order.mjs';
import { db } from '../src/utils/db.server.mjs';
import { shouldBeAdmin } from '../src/middlewares/authentication.mjs';

jest.mock('../src/models/Order.mjs');
jest.mock('../src/middlewares/authentication.mjs', () => ({
  shouldBeAdmin: (req, res, next) => {
    req.user = { role: 'ROLE_ADMIN' };
    next();
  },
}));

jest.mock('../src/utils/db.server.mjs', () => ({
  db: {
    order: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use(OrderRoutes);

describe('Order Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get a list of orders', async () => {
    const mockOrders = [
      { id: '1', date: '2024-07-24', status: 'pending', total_amount: 100, user_id: '1' },
      { id: '2', date: '2024-07-25', status: 'completed', total_amount: 200, user_id: '2' },
    ];
    Order.findToClient.mockResolvedValue(mockOrders);
    Order.countDocuments.mockResolvedValue(2);

    const res = await request(app)
      .get('/orders')
      .expect(200);

    expect(res.body.data).toEqual(mockOrders);
    expect(res.body.totalPages).toBe(1);
    expect(res.body.totalCount).toBe(2);
    expect(Order.findToClient).toHaveBeenCalledWith({}, 1, 10);
    expect(Order.countDocuments).toHaveBeenCalledWith({});
  });

  it('should return orders based on search query', async () => {
    const mockOrders = [
      { id: '1', date: '2024-07-24', status: 'pending', total_amount: 100, user_id: '1' },
    ];
    Order.findToClient.mockResolvedValue(mockOrders);
    Order.countDocuments.mockResolvedValue(1);

    const res = await request(app)
      .get('/orders')
      .query({ search: 'John' })
      .expect(200);

    expect(res.body.data).toEqual(mockOrders);
    expect(res.body.totalPages).toBe(1);
    expect(res.body.totalCount).toBe(1);
    expect(Order.findToClient).toHaveBeenCalledWith(
      { $or: [{ 'user.firstname': { $regex: /John/i } }, { 'user.lastname': { $regex: /John/i } }] },
      1,
      10
    );
    expect(Order.countDocuments).toHaveBeenCalledWith(
      { $or: [{ 'user.firstname': { $regex: /John/i } }, { 'user.lastname': { $regex: /John/i } }] }
    );
  });
});
