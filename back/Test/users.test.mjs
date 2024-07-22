import request from 'supertest';
import express from 'express';
import User from "../src/routes/users.mjs";
import { db } from '../src/utils/db.server.mjs';
import { generateTestToken } from '../src/utils/jwt.mjs';
import * as dotenv from "dotenv";
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(express.json());
app.use(User);


jest.mock('../src/middlewares/authentication.mjs', () => ({
    shouldBeAdmin: (req, res, next) => next(),
    shouldBeAuthenticate: (req, res, next) => {
      req.user = { id: 'user123', role: 'ROLE_ADMIN' };
      next();
    }
}));

//const SECONDS = 1000;
const SECONDS = 1000;
jest.setTimeout(70 * SECONDS)
/*
beforeAll(async () => {
    
    const mongooseOptions = {
        
        serverSelectionTimeoutMS: 30000, // 30 seconds
      };
   
      if (!process.env.DATABASE_URL_TEST) {
        throw new Error('DATABASE_URL_TEST is not defined in the environment variables');
      }
    
      try {
        await mongoose.connect(process.env.DATABASE_URL_TEST, mongooseOptions);
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      }
  });
  
  */
  beforeEach(async () => {
    // Clean up the database before each test
    await db.address.deleteMany({});
    await db.user.deleteMany({});
  });
  
  afterAll(async () => {
    // Disconnect from the database after all tests
    await mongoose.disconnect();
  });
  
  describe('Users API', () => {
    
    it('should create a new user', async () => {
      const newUser = { email: 'test@example.com', password: 'password123', firstname: 'John', lastname: 'Doe', role: 'ROLE_ADMIN' };
  
      const response = await request(app)
        .post('/users')
        .send(newUser);
  
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
    }, 70 * SECONDS);
  
    it('should get the user profile', async () => {
      const user = await db.user.create({
        data: { email: 'profile@example.com', password: 'password123', firstname: 'Jane', lastname: 'Doe', role: 'ROLE_ADMIN' },
      });
  
      const token = generateTestToken(user.id);
  
      const response = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.email).toBe(user.email);
    });
  
    it('should get all users', async () => {
      const adminUser = await db.user.create({
        data: { email: 'admin@example.com', password: 'password123', firstname: 'Admin', lastname: 'User', role: 'ROLE_ADMIN' },
      });
      const token = generateTestToken(adminUser.id);
  
      await db.user.createMany({
        data: [
          { email: 'user1@example.com', password: 'password123', firstname: 'Alice', lastname: 'Smith', role: 'ROLE_ADMIN' },
          { email: 'user2@example.com', password: 'password123', firstname: 'Bob', lastname: 'Jones', role: 'ROLE_ADMIN' },
        ],
      });
  
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });
  
    it('should update a user', async () => {
      const user = await db.user.create({
        data: { email: 'update@example.com', password: 'password123', firstname: 'Chris', lastname: 'Brown', role: 'ROLE_ADMIN' },
      });
  
      const token = generateTestToken(user.id);
  
      const response = await request(app)
        .put(`/users/${user.id}`)
        .send({ email: 'updated@example.com', firstname: 'Chris', lastname: 'Brown', role: 'ROLE_ADMIN' })
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.email).toBe('updated@example.com');
    });
  
    it('should delete a user', async () => {
      const user = await db.user.create({
        data: { email: 'delete@example.com', password: 'password123', firstname: 'Delete', lastname: 'Me', role: 'ROLE_ADMIN' },
      });
  
      const token = generateTestToken(user.id);
  
      const response = await request(app)
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Compte supprimé avec succès');
  
      const deletedUser = await db.user.findUnique({ where: { id: user.id } });
      expect(deletedUser).toBeNull();
    });
  
    it('should get user stats', async () => {
      const adminUser = await db.user.create({
        data: { email: 'admin@example.com', password: 'password123', firstname: 'Admin', lastname: 'User', role: 'ROLE_ADMIN' },
      });
      const token = generateTestToken(adminUser.id);
  
      const response = await request(app)
        .get('/users/stats')
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('totalUsers');
      expect(response.body.data).toHaveProperty('newUsers');
      expect(response.body.data).toHaveProperty('totalRevenue');
      expect(response.body.data).toHaveProperty('totalRevenuePerDate');
    });
});