import request from 'supertest';
import express from 'express';
import UserRoutes from "../src/routes/users.mjs";
import User from '../src/models/User.mjs';
import { db } from '../src/utils/db.server.mjs';
import { generateTestToken } from '../src/utils/jwt.mjs';
import * as dotenv from "dotenv";
import { sendConfirmationEmail } from '../src/utils/mailer.mjs';
import { generateConfirmationToken } from '../src/utils/jwt.mjs';

jest.mock('../src/middlewares/authentication.mjs', () => ({
  shouldBeAuthenticate: (req, res, next) => {
    req.user = { id: '1', role: 'ROLE_USER' }; 
    next();
  },
  shouldBeAdmin: (req, res, next) => {
    req.user = { role: 'ROLE_ADMIN' };
    next();
  },
}));

jest.mock('../src/utils/db.server.mjs', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
  },
}));
jest.mock('../src/models/User.mjs');
jest.mock('../src/utils/mailer.mjs');
jest.mock('../src/utils/jwt.mjs');

dotenv.config();

const app = express();
app.use(express.json());
app.use(UserRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user and send confirmation email', async () => {
    const mockUser = {
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
      password: 'Password123!',
    };
    const createdUser = { id: '1', email: 'test@example.com', firstname: 'John', lastname: 'Doe' };

    db.user.findUnique.mockResolvedValue(null);
    db.user.create.mockResolvedValue(createdUser);
    generateConfirmationToken.mockReturnValue('token');
    sendConfirmationEmail.mockResolvedValue();

    const res = await request(app)
      .post('/users')
      .send(mockUser)
      .expect(201);

    expect(res.body.data).toEqual(createdUser);
    expect(db.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(db.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
      }),
      select: expect.any(Object),
    });
    expect(generateConfirmationToken).toHaveBeenCalledWith('1');
    expect(sendConfirmationEmail).toHaveBeenCalledWith('test@example.com', 'token');
  });

  it('should return 400 if user already exists', async () => {
    db.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' });

    const res = await request(app)
      .post('/users')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        firstname: 'John',
        lastname: 'Doe',
      })
      .expect(400);

    expect(res.body.message).toBe("L'utilisateur existe déjà.");
    expect(db.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
  });

  it('should return 422 for validation errors', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'not-an-email' })
      .expect(422);

    expect(res.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'email', msg: 'Adresse e-mail invalide.' }),
      ])
    );
  });

  it('should return current user details', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
    };
    User.findOne.mockResolvedValue(mockUser);

    const res = await request(app)
      .get('/users/me')
      .expect(200);

    expect(res.body.data).toEqual(mockUser);
    expect(User.findOne).toHaveBeenCalledWith({ id: '1' });
  });

  it('should return 400 if user not found', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .get('/users/me')
      .expect(400);

    expect(res.body.message).toBe('Utilisateur inexistant.');
    expect(User.findOne).toHaveBeenCalledWith({ id: '1' });
  });

  it('should get a list of users', async () => {
    const mockUsers = [
      { id: '1', email: 'test1@example.com', firstname: 'John', lastname: 'Doe' },
      { id: '2', email: 'test2@example.com', firstname: 'Jane', lastname: 'Smith' },
    ];
    User.findToClient.mockResolvedValue(mockUsers);
    User.countDocuments.mockResolvedValue(2);

    const res = await request(app)
      .get('/users')
      .expect(200);

    expect(res.body.data).toEqual(mockUsers);
    expect(res.body.totalPages).toBe(1);
    expect(res.body.totalCount).toBe(2);
    expect(User.findToClient).toHaveBeenCalledWith({}, 1, 10);
    expect(User.countDocuments).toHaveBeenCalledWith({});
  });

  it('should return users based on search query', async () => {
    const mockUsers = [
      { id: '1', email: 'search@example.com', firstname: 'John', lastname: 'Doe' },
    ];
    User.findToClient.mockResolvedValue(mockUsers);
    User.countDocuments.mockResolvedValue(1);

    const res = await request(app)
      .get('/users')
      .query({ search: 'search' })
      .expect(200);

    expect(res.body.data).toEqual(mockUsers);
    expect(res.body.totalPages).toBe(1);
    expect(res.body.totalCount).toBe(1);
    expect(User.findToClient).toHaveBeenCalledWith(
      { $or: [{ email: { $regex: /search/i } }, { firstname: { $regex: /search/i } }, { lastname: { $regex: /search/i } }] },
      1,
      10
    );
    expect(User.countDocuments).toHaveBeenCalledWith(
      { $or: [{ email: { $regex: /search/i } }, { firstname: { $regex: /search/i } }, { lastname: { $regex: /search/i } }] }
    );
  });
});
