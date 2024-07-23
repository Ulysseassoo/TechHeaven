import request from 'supertest';
import express from 'express';
import AuthRouter from '../src/routes/auth.mjs';
import { db } from '../src/utils/db.server.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import * as dotenv from "dotenv";
import { sendNotificationEmail, sendPasswordResetEmail } from '../src/utils/mailer.mjs';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api/auth', AuthRouter);


jest.mock('../src/middlewares/authentication.mjs', () => ({
    shouldBeAdmin: (req, res, next) => next(),
    shouldBeAuthenticate: (req, res, next) => {
      req.user = { id: 'user123', role: 'ROLE_ADMIN' };
      next();
    }
}));

jest.mock('../src/utils/db.server.mjs', () => ({
  db: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
    },
    passwordRecovery: {
      create: jest.fn(),
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  }
}));

beforeAll(async () => {
  await db.$connect();
});

afterAll(async () => {
  await db.$disconnect();
});

beforeEach(async () => {
  await db.user.deleteMany({});
  await db.passwordRecovery.deleteMany({});
});

describe('Auth API', () => {
  // Test de la route "/verify"
  it('should confirm the user account with a valid token', async () => {
    const token = jwt.sign({ userId: 'user-id', type: 'confirmation' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    db.user.findUnique.mockResolvedValueOnce({ id: 'user-id', has_confirmed_account: false });
    db.user.update.mockResolvedValueOnce({ id: 'user-id', has_confirmed_account: true });

    const response = await request(app)
      .post('/api/auth/verify')
      .send({ token });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 200);
    expect(response.body).toHaveProperty('message', 'Compte confirmé avec succès.');
  });

  it('should return 401 for an invalid token on "/verify"', async () => {
    const response = await request(app)
      .post('/api/auth/verify')
      .send({ token: 'invalid-token' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('status', 401);
    expect(response.body).toHaveProperty('message', 'Token invalide ou expiré.');
  });

  // Test de la route "/auth"
  it('should authenticate a user with correct credentials', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await db.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        has_confirmed_account: true,
        number_connexion_attempts: 0,
        role: 'user'
      }
    });

    const response = await request(app)
      .post('/api/auth/auth')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 200);
    expect(response.body).toHaveProperty('data');
  });

  it('should return 401 for incorrect credentials on "/auth"', async () => {
    const response = await request(app)
      .post('/api/auth/auth')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('status', 401);
    expect(response.body).toHaveProperty('message', 'Email ou mot de passe invalide');
  });

  // Test de la route "/reset/password"
  it('should initiate password reset with valid email', async () => {
    await db.user.create({
      data: { email: 'test@example.com' }
    });

    const response = await request(app)
      .post('/api/auth/reset/password')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 200);
    expect(response.body).toHaveProperty('message', 'Ok');
  });

  it('should return 200 for non-existing email on "/reset/password"', async () => {
    const response = await request(app)
      .post('/api/auth/reset/password')
      .send({ email: 'nonexistent@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 200);
    expect(response.body).toHaveProperty('message', 'Ok');
  });

  // Test de la route "/verify/code"
  it('should verify the reset code with correct code and email', async () => {
    const user = await db.user.create({
      data: { email: 'test@example.com' }
    });

    const code = '123456';
    await db.passwordRecovery.create({
      data: {
        user_id: user.id,
        verification_code: code,
        code_validation_time: moment().utc().add(5, 'm').toDate()
      }
    });

    const response = await request(app)
      .post('/api/auth/verify/code')
      .send({ code, email: 'test@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 200);
    expect(response.body).toHaveProperty('message', 'Ok');
  });

  it('should return 401 for incorrect or expired code on "/verify/code"', async () => {
    const response = await request(app)
      .post('/api/auth/verify/code')
      .send({ code: 'wrongcode', email: 'test@example.com' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('status', 401);
    expect(response.body).toHaveProperty('message', 'Le code a expiré');
  });

  // Test de la route "/change/password"
  it('should change password with valid code and email', async () => {
    const user = await db.user.create({
      data: { email: 'test@example.com' }
    });

    const code = '123456';
    await db.passwordRecovery.create({
      data: {
        user_id: user.id,
        verification_code: code,
        code_validation_time: moment().utc().add(5, 'm').toDate()
      }
    });

    const response = await request(app)
      .post('/api/auth/change/password')
      .send({ email: 'test@example.com', password: 'newpassword123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 200);
    expect(response.body).toHaveProperty('message', 'Mot de passe mis à jour avec succès.');
  });

  it('should return 401 for expired code on "/change/password"', async () => {
    const user = await db.user.create({
      data: { email: 'test@example.com' }
    });

    const expiredCode = '123456';
    await db.passwordRecovery.create({
      data: {
        user_id: user.id,
        verification_code: expiredCode,
        code_validation_time: moment().utc().subtract(1, 'm').toDate() // Code expiré
      }
    });

    const response = await request(app)
      .post('/api/auth/change/password')
      .send({ email: 'test@example.com', password: 'newpassword123' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('status', 401);
    expect(response.body).toHaveProperty('message', 'Le code a expiré');
  });
});
