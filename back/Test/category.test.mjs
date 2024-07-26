import request from 'supertest';
import express from 'express';
import * as dotenv from "dotenv";
import CategoryRoutes from '../src/routes/category.mjs';
import { db } from '../src/utils/db.server.mjs';
import Category from '../src/models/Category.mjs';

jest.mock('../src/utils/db.server.mjs', () => ({
  db: {
    category: {
      findUnique: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}));
jest.mock('../src/models/Category.mjs');

dotenv.config();
const app = express();
app.use(express.json());
app.use(CategoryRoutes);

jest.mock('../src/middlewares/authentication.mjs', () => ({
  shouldBeAdmin: (req, res, next) => next(),
  shouldBeAuthenticate: (req, res, next) => {
    req.user = { id: 'user123', role: 'ROLE_ADMIN' };
    next();
  }
}));

describe('Category Routes', () => {
  const token = 'mocked-auth-token';
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new category', async () => {
    const mockCategory = { id: 1, name: 'Test Category' };
    db.category.create.mockResolvedValue(mockCategory);

    const res = await request(app)
      .post('/categories')
      .send({ name: 'Test Category' })
      .expect(201);

    expect(res.body).toEqual({ status: 201, data: mockCategory });
    expect(db.category.create).toHaveBeenCalledWith({ data: { name: 'Test Category' } });
  });

  it('should get all categories', async () => {
    const mockCategories = [{ id: 1, name: 'Test Category' }];
    Category.find.mockResolvedValue(mockCategories);
    Category.countDocuments.mockResolvedValue(1);

    const res = await request(app)
      .get('/categories')
      .set("Authorization", `Bearer ${token}`)
      // .expect(200);

    expect(res.body).toEqual({
      status: 200,
      totalPages: 1,
      currentPage: 1,
      totalCount: 1,
      data: mockCategories
    });
    expect(Category.find).toHaveBeenCalledWith({});
    expect(Category.countDocuments).toHaveBeenCalledWith({});
  });

  it('should get a category by ID', async () => {
    const mockCategory = { id: 1, name: 'Test Category' };
    Category.findOne.mockResolvedValue(mockCategory);

    const res = await request(app)
      .get('/categories/1')
      .expect(200);

    expect(res.body).toEqual({ status: 200, data: mockCategory });
    expect(Category.findOne).toHaveBeenCalledWith({ id: '1' });
  });

  it('should update a category', async () => {
    const mockCategory = { id: 1, name: 'Updated Category' };
    db.category.update.mockResolvedValue(mockCategory);

    const res = await request(app)
      .put('/categories/1')
      .send({ name: 'Updated Category' })
      .expect(200);

    expect(res.body).toEqual({ status: 200, data: mockCategory });
    expect(db.category.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { name: 'Updated Category' }
    });
  });

  it('should delete a category', async () => {
    db.category.delete.mockResolvedValue({});

    const res = await request(app)
      .delete('/categories/1')
      .expect(200);

    expect(res.body).toEqual({ status: 200, message: 'Catégorie supprimée avec succès' });
    expect(db.category.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });

});
