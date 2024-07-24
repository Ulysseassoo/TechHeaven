import { PrismaClient } from "@prisma/client";
import mongoose from "../src/middlewares/mongooseConfig.mjs";
import * as dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import moment from "moment";
import { db } from "../src/utils/db.server.mjs";
import { randomInt } from "crypto";

const prisma = new PrismaClient();

const categories = ["Ordinateurs", "Téléphones Mobiles", "Appareils Photo", "Audio & Vidéo", "Technologie Portable", "Accessoires"];

const productNames = [
  "iPhone 14 Pro",
  "Samsung Galaxy S22",
  "Google Pixel 6",
  "OnePlus 9 Pro",
  "Sony Xperia 1 III",
  "Huawei P50 Pro",
  "Xiaomi Mi 11 Ultra",
  "Oppo Find X3 Pro",
  "Asus ROG Phone 5",
  "Nokia 8.3 5G",
  "Motorola Edge 20 Pro",
  "Realme GT",
  "Vivo X60 Pro",
  "LG Wing",
  "ZTE Axon 30 Ultra",
  "Lenovo Legion Phone Duel",
  "Microsoft Surface Duo",
  "Honor Magic 3 Pro",
  "Black Shark 4 Pro",
  "Redmi Note 10 Pro",
  "Poco F3",
  "TCL 20 Pro 5G",
  "Fairphone 4",
  "Nubia Red Magic 6",
  "Meizu 18 Pro",
  "Alcatel 3L",
  "HTC U20 5G",
  "Infinix Zero 8",
  "Tecno Phantom X",
  "Ulefone Armor 11 5G",
  "Doogee S97 Pro",
  "Cubot KingKong 5 Pro",
  "Oukitel WP10",
  "Sony WH-1000XM4",
  "Bose QuietComfort 45",
  "Apple AirPods Pro",
  "Samsung Galaxy Buds Pro",
  "Jabra Elite 85t",
  "Sennheiser Momentum True Wireless 2",
  "Anker Soundcore Liberty Air 2 Pro",
  "Beats Studio Buds",
  "Google Pixel Buds A-Series",
  "Sony WF-1000XM4",
  "Bose Sport Earbuds",
  "JBL Live Pro+",
  "Skullcandy Indy ANC",
  "Amazfit GTR 3 Pro",
  "Garmin Fenix 6 Pro",
  "Fitbit Sense",
  "Samsung Galaxy Watch 4",
  "Apple Watch Series 7",
  "Huawei Watch GT 3",
  "TicWatch Pro 3",
  "Fossil Gen 6",
  "Withings ScanWatch",
  "Suunto 7",
  "Polar Vantage V2",
  "Coros Vertix 2"
];

dotenv.config();

const getRandomDateBetween2023And2024 = () => {
  const start = moment("2023-01-01").startOf("year").valueOf();
  const end = moment().endOf("day").valueOf();

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

  await db.user.create({
    data: {
      firstname: "store",
      lastname: "keeper",
      email: "storekeeper@prisma.io",
      role: "ROLE_STORE_KEEPER",
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

    for (let v = 0; v < 10; v++) {
      const p = await db.product.create({
        data: {
          name: productNames[v * (i + 1)],
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price()),
          quantity: 110,
          brand: faker.lorem.word(),
          categoryId: category.id,
        },
      });


      await db.product.update({
        where: {
          id: p.id,
        },
        data: {
          ...p,
          quantity: randomInt(1, 100),
        }
      })
    }
  }

  for (let i = 0; i < 100; i++) {
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
            quantity: randomInt(100),
            product_name: faker.commerce.productName(),
            product_description: faker.commerce.productDescription(),
            unit_price: 175,
            order_id: or.id,
          },
        });
        
      }
    }

    for (let d = 0; d < 3; d++) {
      await db.address.create({
        data: {
          city: faker.location.city(),
          country: faker.location.country(),
          postal_code: faker.location.zipCode(),
          address: faker.location.streetAddress(),
          is_selected: d === 0 ? true : false,
          other: faker.location.secondaryAddress(),
          user_id: u.id,
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
      
      const category = await db.category.create({
        data: {
          name: categories[1]
        }
      });

      const product = await db.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price()),
          quantity: 90,
          brand: faker.lorem.word(),
          categoryId: category.id,
        },
      });

      for (let l = 0; l < 3; l++) {
        await db.orderDetail.create({
          data: {
            quantity: 2,
            product_name: product.name,
            product_description: product.description,
            unit_price: product.price,
            order_id: or.id,
            product_id: product.id
          },
        });
      }

      await db.delivery.create({
        data: {
          address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.zipCode()}, ${faker.location.country()}`,
          client_name: `${u.firstname} ${u.lastname}`,
          order_id: or.id,
          following_number: faker.string.uuid()
        }
      })
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
