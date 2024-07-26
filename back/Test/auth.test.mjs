import request from "supertest";
import express from "express";
import AuthRouter from "../src/routes/auth.mjs";
import { db } from "../src/utils/db.server.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";
import * as dotenv from "dotenv";
import {
  sendNotificationEmail,
  sendPasswordResetEmail,
} from "../src/utils/mailer.mjs";
import { shouldBeAuthenticate } from "../src/middlewares/authentication.mjs";
import { shouldBeAdmin } from "../src/middlewares/authentication.mjs";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/auth", AuthRouter);

jest.mock("../src/middlewares/authentication.mjs", () => ({
  shouldBeAuthenticate: (req, res, next) => {
    req.user = { id: "1", role: "ROLE_USER" };
    next();
  },
  hasAuthenticate: (req, res, next) => {
    req.user = { id: "1", role: "ROLE_USER" };
    next();
  },
  shouldBeAdmin: (req, res, next) => {
    req.user = { role: "ROLE_ADMIN" };
    next();
  },
}));

jest.mock("../src/utils/db.server.mjs", () => ({
  db: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    passwordRecovery: {
      create: jest.fn(),
      upsert: jest.fn(),
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
}));

jest.mock("bcryptjs");

beforeAll(async () => {
  await db.$connect();
});

afterAll(async () => {
  await db.$disconnect();
});

beforeEach(async () => {
  await db.user.deleteMany({});
  await db.passwordRecovery.deleteMany({});
  db.user.create.mockResolvedValue({ id: "user-id" });
  db.passwordRecovery.create.mockResolvedValue({
    code: "123456",
    code_validation_time: moment().utc().add(5, "m").toDate(),
  });
});

describe("Auth API", () => {
  // Test de la route "/verify"
  it("should confirm the user account with a valid token", async () => {
    const token = jwt.sign(
      { userId: "user-id", type: "confirmation" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    db.user.findUnique.mockResolvedValueOnce({
      id: "user-id",
      has_confirmed_account: false,
    });
    db.user.update.mockResolvedValueOnce({
      id: "user-id",
      has_confirmed_account: true,
    });

    const response = await request(app)
      .post("/api/auth/verify")
      .send({ token });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", 200);
    expect(response.body).toHaveProperty(
      "message",
      "Compte confirmé avec succès."
    );
  });

  it('should return 401 for an invalid token on "/verify"', async () => {
    const invalidToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhYTJiOGExOS1mMWU2LTRjYTQtOTc5Yi03NDQ1NDlkYzQ4OTYiLCJ0eXBlIjoic2Vzc2lvbiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjE5MzkxNDIsImV4cCI6MTcyMjAyNTU0Mn0.L85ygM4sBi_CETFht3YiRbXOjKbPnS6JqndTVA_t28k";

    const response = await request(app)
      .post("/api/auth/verify")
      .send({ token: invalidToken });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Token invalide pour la confirmation de compte."
    );
  });

  it("should authenticate a user with correct credentials", async () => {
    const hashedPassword = "hashedPassword123";

    bcrypt.hash.mockResolvedValue(hashedPassword);

    bcrypt.compare.mockResolvedValue(true);

    const user = await db.user.create({
      data: {
        email: "test@example.com",
        password: hashedPassword,
        has_confirmed_account: true,
        number_connexion_attempts: 0,
        role: "ROLE_USER",
      },
    });

    db.user.findUnique.mockResolvedValue({
      email: "test@example.com",
      password: hashedPassword,
      has_confirmed_account: true,
      number_connexion_attempts: 0,
      role: "ROLE_USER",
    });

    const response = await request(app)
      .post("/api/auth/auth")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", 200);
    expect(response.body).toHaveProperty("data");
  });

  it('should return 401 for incorrect credentials on "/auth"', async () => {
    const hashedPassword = "hashedPassword123";

    bcrypt.hash.mockResolvedValue(hashedPassword);

    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post("/api/auth/auth")
      .send({ email: "test@exameple.com", password: hashedPassword });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("status", 401);
    expect(response.body).toHaveProperty(
      "message",
      "Email ou mot de passe invalide"
    );
  });

  it("should initiate password reset with valid email", async () => {
    db.user.create.mockResolvedValue({
      email: "test@example.com",
    });

    const response = await request(app)
      .post("/api/auth/reset/password")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", 200);
    expect(response.body).toHaveProperty("message", "Ok");
  });

  it('should return 200 for non-existing email on "/reset/password"', async () => {
    const response = await request(app)
      .post("/api/auth/reset/password")
      .send({ email: "nonexistent@example.com" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", 200);
    expect(response.body).toHaveProperty("message", "Ok");
  });

  it("should verify the reset code with correct code and email", async () => {
    // Mock user creation
    db.user.create.mockResolvedValueOnce({ id: "user-id" });

    const user = await db.user.create({
      data: { email: "test@example.com" },
    });

    expect(user).toHaveProperty("id");

    const code = "123456";
    const codeValidationTime = moment().utc().add(5, "m").toDate();

    // Mock password recovery code creation
    db.passwordRecovery.create.mockResolvedValueOnce({
      user_id: user.id,
      verification_code: code,
      code_validation_time: codeValidationTime,
    });

    await db.passwordRecovery.create({
      data: {
        user_id: user.id,
        verification_code: code,
        code_validation_time: codeValidationTime,
      },
    });

    // Mock password recovery code verification
    db.passwordRecovery.findUnique.mockResolvedValueOnce({
      user_id: user.id,
      verification_code: code,
      code_validation_time: codeValidationTime,
    });

    const response = await request(app)
      .post("/api/auth/verify/code")
      .send({ code, email: "test@example.com" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", 200);
    expect(response.body).toHaveProperty("message", "Ok");
  });

  it('should return 401 for incorrect or expired code on "/verify/code"', async () => {
    db.passwordRecovery.findUnique.mockResolvedValueOnce(null);

    const response = await request(app)
      .post("/api/auth/verify/code")
      .send({ code: "wrongcode", email: "test@example.com" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("status", 401);
    expect(response.body).toHaveProperty("message", "Le code a expiré");
  });

  it("should change password with valid code and email", async () => {
    db.user.create.mockResolvedValueOnce({
      id: "user-id",
      email: "test@example.com",
    });

    const user = await db.user.create({
      data: { email: "test@example.com" },
    });

    expect(user).toHaveProperty("id");

    const code = "123456";
    const codeValidationTime = moment().utc().add(5, "m").toDate();

    db.passwordRecovery.create.mockResolvedValueOnce({
      user_id: user.id,
      verification_code: code,
      code_validation_time: codeValidationTime,
    });

    await db.passwordRecovery.create({
      data: {
        user_id: user.id,
        verification_code: code,
        code_validation_time: codeValidationTime,
      },
    });

    db.passwordRecovery.findUnique.mockResolvedValueOnce({
      user_id: user.id,
      verification_code: code,
      code_validation_time: codeValidationTime,
    });

    const response = await request(app)
      .post("/api/auth/change/password")
      .send({ email: "test@example.com", password: "newpassword123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", 200);
    expect(response.body).toHaveProperty(
      "message",
      "Mot de passe mis à jour avec succès."
    );
  });

  it('should return 401 for expired code on "/change/password"', async () => {
    db.user.create.mockResolvedValueOnce({
      id: "user-id",
      email: "test@example.com",
    });

    const user = await db.user.create({
      data: { email: "test@example.com" },
    });

    expect(user).toHaveProperty("id");

    const expiredCode = "123456";
    const expiredCodeValidationTime = moment().utc().subtract(1, "m").toDate();

    db.passwordRecovery.create.mockResolvedValueOnce({
      user_id: user.id,
      verification_code: expiredCode,
      code_validation_time: expiredCodeValidationTime,
    });

    await db.passwordRecovery.create({
      data: {
        user_id: user.id,
        verification_code: expiredCode,
        code_validation_time: expiredCodeValidationTime,
      },
    });

    db.passwordRecovery.findUnique.mockResolvedValueOnce({
      user_id: user.id,
      verification_code: expiredCode,
      code_validation_time: expiredCodeValidationTime,
    });

    const response = await request(app)
      .post("/api/auth/change/password")
      .send({ email: "test@example.com", password: "newpassword123" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("status", 401);
    expect(response.body).toHaveProperty("message", "Le code a expiré");
  });
});
