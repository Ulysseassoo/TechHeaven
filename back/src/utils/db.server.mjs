import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./security.mjs";
import { mongoCreate, mongoDelete, mongoUpdate, mongoUpsert } from "./sync.mjs";
import { sendEmailAlert } from "./mailer.mjs";

// Avoid multiple connections to the database
let db = new PrismaClient();

if (!global.__db) {
  global.__db = new PrismaClient();
}

db = global.__db;

const extendedDb = db.$extends({
  name: "db",
  query: {
    user: {
      async create({ args, query }) {
        args.data.password = hashPassword(args.data.password);
        const result = await query(args);
        return result;
      },
      async upsert({ args, query }) {
        if (args.create.password || args.update.password) {
          args.create.password = hashPassword(args.create.password);
          args.update.password = hashPassword(args.update.password);
        }
        const result = await query(args);
        return result;
      },
    },
    product: {
      async create({ args, query }) {
        const result = await query(args);
        await extendedDb.stockHistory.create({
          data: {
            product_id: result.id,
            quantity: args.data.quantity,
            date: new Date(),
          },
        });
        return result;
      },
      async update({ args, query }) {
        const result = await query(args);
        await extendedDb.stockHistory.create({
          data: {
            product_id: result.id,
            quantity: args.data.quantity,
            date: new Date(),
          },
        });

        if(args.data.quantity <= 10) {
          await sendEmailAlert({
            product: result,
          });
        }
        return result;
      },
    },
    $allModels: {
      async create({ args, query, model }) {
        const result = await query(args);
        await mongoCreate({
          data: {
            ...args.data,
            id: result.id,
          },
          model,
        });
        return result;
      },
      async delete({ args, query, model }) {
        const result = await query(args);
        await mongoDelete({
          model: model,
          where: args.where,
        });
        return result;
      },
      async update({ args, query, model }) {
        const result = await query(args);
        await mongoUpdate({
          model: model,
          data: args.data,
          where: args.where,
        });
        return result;
      },
      async upsert({ args, query, model }) {
        const result = await query(args);
        await mongoUpsert({
          model: model,
          where: args.where,
          create: {
            ...args.create,
            id: result.id,
          },
          update: args.update,
        });
        return result;
      },
    },
  },
});

export { extendedDb as db };
