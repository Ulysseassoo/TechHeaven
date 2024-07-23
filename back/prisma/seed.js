import { PrismaClient } from "@prisma/client";
import mongoose from "../src/middlewares/mongooseConfig.mjs";
import * as dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import moment from "moment";
import { db } from "../src/utils/db.server.mjs";

const prisma = new PrismaClient();

const categories = ["Computers", "Mobile Phones", "Cameras", "Audio & Video", "Wearable Technology", "Accessories"];

dotenv.config();

const getRandomDateBetween2023And2024 = () => {
  const start = moment("2023-01-01").startOf("year").valueOf();
  const end = moment("2024-12-31").endOf("year").valueOf();

  const randomTimestamp = Math.floor(Math.random() * (end - start + 1)) + start;

  return moment(randomTimestamp);
};

async function main() {
  const globalPassword = "Adminadmin12";

  await db.user.create({
    data: {
      firstname: "gouenji",
      lastname: "star",
      email: "gouenji@prisma.io",
      role: "ROLE_ADMIN",
      password: globalPassword,
      last_updated_password: new Date(),
      has_confirmed_account: true,
    },
  });

  const alert = await db.alert.create({
    data: {
      name: "Newsletter",
      type: "NEWSLETTER",
    },
  });

  for (let i = 0; i < categories.length; i++) {
    const category = await db.category.create({
      data: {
        name: categories[i]
      }
    });

    await db.alert.create({
      data: {
        name: "Newsletter",
        type: "CATEGORY",
        param: categories[i]
      },
    });

    for (let i = 0; i < 30; i++) {
      await db.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price()),
          quantity: 90,
          brand: faker.lorem.word(),
          categoryId: category.id,
        },
      });
    }
  }

  for (let i = 0; i < 10; i++) {
    const u = await db.user.create({
      data: {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        role: "ROLE_USER",
        password: globalPassword,
        created_at: getRandomDateBetween2023And2024().format(),
        last_updated_password: new Date(),
        has_confirmed_account: true,
        phone: faker.phone.number(),
      },
    });

    await db.preference.create({
      data: {
        user_id: u.id,
        alert_id: alert.id,
        isEnabled: false,
      },
    });

    const alerts = await db.alert.findMany({
      where: {
        id: {
          not: alert.id
        }
      }
    });

    for (let j = 0; j < alerts.length; j++) {
      const z = alerts[j];
      await db.preference.create({
        data: {
          user_id: u.id,
          alert_id: z.id,
          isEnabled: false,
        },
      });
    }

    for (let k = 0; k < 2; k++) {
      const or = await db.order.create({
        data: {
            user_id: u.id,
            total_amount: 500,
        }
      });

      for (let l = 0; l < 3; l++) {
        await db.orderDetail.create({
          data: {
            quantity: 2,
            product_name: faker.commerce.productName(),
            product_description: faker.commerce.productDescription(),
            unit_price: 175,
            order_id: or.id,
          },
        });
      }
    }

    for (let i = 0; i < 3; i++) {
      await db.address.create({
        data: {
          city: faker.location.city(),
          country: faker.location.country(),
          postal_code: faker.location.zipCode(),
          address: faker.location.streetAddress(),
          is_selected: i === 0 ? true : false,
          other: faker.location.secondaryAddress(),
          user_id: u.id,
        },
      });
    }

    await db.cart.create({
      data: {
        user_id: u.id,
      },
    });
  }

  setTimeout(async () => {
    console.log("Seeding completed");
    await prisma.$disconnect();
    await mongooseDatabase.close();
  }, 5000);
}

async function start() {
  await main();
}

mongoose.connect(process.env.DATABASE_URL_MONGODB, {
  useNewUrlParser: true,
});
const mongooseDatabase = mongoose.connection;

mongooseDatabase.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
mongooseDatabase.once("open", () => {
  console.log("Connected to MongoDB successfully");
  // Start your application logic here or trigger it to ensure it starts after the connection is established
  mongooseDatabase
    .dropDatabase()
    .then(() => {
      console.log("Dropped database");
      start().catch((e) => {
        console.error(e);
        process.exit(1);
      });
    })
    .catch((e) => {
      console.log("Didn't drop the database", e);
    });
});
