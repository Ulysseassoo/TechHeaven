import request from 'supertest';
import express from 'express';
import OrderRoutes from '../src/routes/order.mjs';
import Order from '../src/models/Order.mjs';
import { db } from '../src/utils/db.server.mjs';

jest.mock('../src/models/Order.mjs');
jest.mock('../src/middlewares/authentication.mjs', () => ({
  shouldBeAdmin: (req, res, next) => {
    req.user = { role: 'ROLE_ADMIN' };
    next();
  },
  shouldBeAuthenticate: (req, res, next) => {
    req.user = { id: 'user123' }; // Mock authenticated user
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
    cart: {
      findFirst: jest.fn(),
    },
    cartHasProducts: {
      findMany: jest.fn(),
    },
    orderDetail: {
      create: jest.fn(),
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
      { $or: [
          { id: { $regex: /John/i } },
          { "order_details.product_name": { $regex: /John/i } },
          { 'user.firstname': { $regex: /John/i } },
          { 'user.lastname': { $regex: /John/i } }
        ] },
      1,
      10
    );
    expect(Order.countDocuments).toHaveBeenCalledWith(
      { $or: [
          { id: { $regex: /John/i } },
          { "order_details.product_name": { $regex: /John/i } },
          { 'user.firstname': { $regex: /John/i } },
          { 'user.lastname': { $regex: /John/i } }
        ] }
    );
  });

  it('should create a new order', async () => {
    const mockBasket = { id: 'basket123', user_id: 'user123', total: 100 };
    const mockProductsOrdered = [
      {
        quantity: 1,
        product: { id: 'prod1', name: 'Product 1', description: 'Desc 1' },
        unit_price: 50,
      },
    ];
    const mockOrder = { id: 'order123', user_id: 'user123', total_amount: 100 };

    db.cart.findFirst.mockResolvedValue(mockBasket);
    db.cartHasProducts.findMany.mockResolvedValue(mockProductsOrdered);
    db.order.create.mockResolvedValue(mockOrder);

    const res = await request(app)
      .post('/orders')
      .expect(200);

    expect(res.body.data).toEqual(mockOrder);
    expect(db.cart.findFirst).toHaveBeenCalledWith({ where: { user_id: 'user123' } });
    expect(db.cartHasProducts.findMany).toHaveBeenCalledWith({ where: { cart_id: 'basket123' }, include: { product: true } });
    expect(db.order.create).toHaveBeenCalledWith({ data: { user_id: 'user123', total_amount: 100 } });
  });

});
