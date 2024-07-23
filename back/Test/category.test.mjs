import request from 'supertest';
import express from 'express';
import * as dotenv from "dotenv";
import CategoryRoutes from '../src/routes/category.mjs';
import { db } from '../src/utils/db.server.mjs';
import Category from '../src/models/Category.mjs';


jest.mock('../src/utils/db.server.mjs');
jest.mock('../src/models/Category.mjs');



dotenv.config();
const app = express();
app.use(express.json());
app.use(CategoryRoutes);

//const SECONDS = 1000;
//jest.setTimeout(70 * SECONDS)

jest.mock('../src/middlewares/authentication.mjs', () => ({
    shouldBeAdmin: (req, res, next) => next(),
    shouldBeAuthenticate: (req, res, next) => {
      req.user = { id: 'user123', role: 'ROLE_ADMIN' }; 
      next();
    }
  }));


  describe('Category Routes', () => {

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
      Category.findToClient.mockResolvedValue(mockCategories);
  
      const res = await request(app)
        .get('/categories')
        .expect(200);
  
      expect(res.body).toEqual({ status: 200, data: mockCategories });
      expect(Category.findToClient).toHaveBeenCalledWith({});
    });
  
    it('should get a category by ID', async () => {
      const mockCategory = { id: 1, name: 'Test Category' };
      Category.findOne.mockResolvedValue(mockCategory);
  
      const res = await request(app)
        .get('/categories/1')
        .expect(200);
  
      expect(res.body).toEqual({ status: 200, data: mockCategory });
      expect(Category.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
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