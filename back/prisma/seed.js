import { PrismaClient } from "@prisma/client";
import mongoose from "../src/middlewares/mongooseConfig.mjs";
import * as dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import moment from "moment";
import { db } from "../src/utils/db.server.mjs";
import { randomInt } from "crypto";
import Product from "../src/models/Product.mjs";

const prisma = new PrismaClient();

const categories = ["Ordinateurs", "Téléphones Mobiles", "Appareils Photo", "Audio & Vidéo", "Technologie Portable", "Appareil pas cher"];

const products = [
  { nom: "iPhone 14 Pro", description: "Un smartphone haut de gamme avec des fonctionnalités avancées et un design élégant.", marque: "Apple" },
  { nom: "Samsung Galaxy S22", description: "Un smartphone puissant avec un écran époustouflant et un excellent appareil photo.", marque: "Samsung" },
  { nom: "Google Pixel 6", description: "Un smartphone avec une expérience Android pure et une qualité d'appareil photo exceptionnelle.", marque: "Google" },
  { nom: "OnePlus 9 Pro", description: "Un smartphone phare avec des performances rapides et un excellent écran.", marque: "OnePlus" },
  { nom: "Sony Xperia 1 III", description: "Un smartphone avec un écran 4K et un appareil photo de qualité professionnelle.", marque: "Sony" },
  { nom: "Huawei P50 Pro", description: "Un smartphone haute performance avec un système de caméra impressionnant.", marque: "Huawei" },
  { nom: "Xiaomi Mi 11 Ultra", description: "Un smartphone avec des spécifications de premier ordre et un ensemble de caméras polyvalent.", marque: "Xiaomi" },
  { nom: "Oppo Find X3 Pro", description: "Un smartphone premium avec un design unique et des fonctionnalités puissantes.", marque: "Oppo" },
  { nom: "Asus ROG Phone 5", description: "Un smartphone de jeu avec un écran à taux de rafraîchissement élevé et un matériel puissant.", marque: "Asus" },
  { nom: "Nokia 8.3 5G", description: "Un smartphone 5G avec des performances solides et une expérience Android propre.", marque: "Nokia" },
  { nom: "Motorola Edge 20 Pro", description: "Un smartphone avec un écran à taux de rafraîchissement élevé et une caméra polyvalente.", marque: "Motorola" },
  { nom: "Realme GT", description: "Un smartphone avec des performances de pointe à un prix abordable.", marque: "Realme" },
  { nom: "Vivo X60 Pro", description: "Un smartphone avec d'excellentes capacités de caméra et un design élégant.", marque: "Vivo" },
  { nom: "LG Wing", description: "Un smartphone unique avec un écran pivotant pour le multitâche.", marque: "LG" },
  { nom: "ZTE Axon 30 Ultra", description: "Un smartphone avec un écran à taux de rafraîchissement élevé et une caméra puissante.", marque: "ZTE" },
  { nom: "Lenovo Legion Phone Duel", description: "Un smartphone de jeu avec des performances rapides et un design innovant.", marque: "Lenovo" },
  { nom: "Microsoft Surface Duo", description: "Un appareil à double écran pour une productivité et une créativité accrues.", marque: "Microsoft" },
  { nom: "Honor Magic 3 Pro", description: "Un smartphone avec des performances puissantes et un design élégant.", marque: "Honor" },
  { nom: "Black Shark 4 Pro", description: "Un smartphone de jeu avec des performances rapides et un écran à taux de rafraîchissement élevé.", marque: "Black Shark" },
  { nom: "Redmi Note 10 Pro", description: "Un smartphone avec un excellent rapport qualité-prix et une caméra polyvalente.", marque: "Redmi" },
  { nom: "Poco F3", description: "Un smartphone avec des performances de pointe à un prix abordable.", marque: "Poco" },
  { nom: "TCL 20 Pro 5G", description: "Un smartphone 5G avec un écran époustouflant et des performances solides.", marque: "TCL" },
  { nom: "Fairphone 4", description: "Un smartphone éthique et durable avec des performances solides.", marque: "Fairphone" },
  { nom: "Nubia Red Magic 6", description: "Un smartphone de jeu avec des performances rapides et un écran à taux de rafraîchissement élevé.", marque: "Nubia" },
  { nom: "Meizu 18 Pro", description: "Un smartphone avec des performances puissantes et un design élégant.", marque: "Meizu" },
  { nom: "Alcatel 3L", description: "Un smartphone abordable avec des fonctionnalités solides.", marque: "Alcatel" },
  { nom: "HTC U20 5G", description: "Un smartphone 5G avec des performances solides et un design élégant.", marque: "HTC" },
  { nom: "Infinix Zero 8", description: "Un smartphone avec des performances puissantes et un design élégant.", marque: "Infinix" },
  { nom: "Tecno Phantom X", description: "Un smartphone avec des performances solides et un design élégant.", marque: "Tecno" },
  { nom: "Ulefone Armor 11 5G", description: "Un smartphone robuste avec des performances solides et une connectivité 5G.", marque: "Ulefone" },
  { nom: "Doogee S97 Pro", description: "Un smartphone robuste avec des performances solides et un design durable.", marque: "Doogee" },
  { nom: "Cubot KingKong 5 Pro", description: "Un smartphone robuste avec des performances solides et un design durable.", marque: "Cubot" },
  { nom: "Oukitel WP10", description: "Un smartphone robuste avec des performances solides et une connectivité 5G.", marque: "Oukitel" },
  { nom: "Sony WH-1000XM4", description: "Un casque antibruit avec une qualité sonore supérieure.", marque: "Sony" },
  { nom: "Bose QuietComfort 45", description: "Un casque antibruit avec un confort exceptionnel et une qualité sonore supérieure.", marque: "Bose" },
  { nom: "Apple AirPods Pro", description: "Des écouteurs sans fil avec une annulation active du bruit et un son de haute qualité.", marque: "Apple" },
  { nom: "Samsung Galaxy Buds Pro", description: "Des écouteurs sans fil avec une annulation active du bruit et un son de haute qualité.", marque: "Samsung" },
  { nom: "Jabra Elite 85t", description: "Des écouteurs sans fil avec une annulation active du bruit et un son de haute qualité.", marque: "Jabra" },
  { nom: "Sennheiser Momentum True Wireless 2", description: "Des écouteurs sans fil avec une qualité sonore exceptionnelle et une annulation active du bruit.", marque: "Sennheiser" },
  { nom: "Anker Soundcore Liberty Air 2 Pro", description: "Des écouteurs sans fil avec une annulation active du bruit et un son de haute qualité.", marque: "Anker" },
  { nom: "Beats Studio Buds", description: "Des écouteurs sans fil avec une annulation active du bruit et un son de haute qualité.", marque: "Beats" },
  { nom: "Google Pixel Buds A-Series", description: "Des écouteurs sans fil avec une qualité sonore exceptionnelle et une intégration parfaite avec les appareils Google.", marque: "Google" },
  { nom: "Sony WF-1000XM4", description: "Des écouteurs sans fil avec une annulation active du bruit et une qualité sonore exceptionnelle.", marque: "Sony" },
  { nom: "Bose Sport Earbuds", description: "Des écouteurs sans fil avec une qualité sonore exceptionnelle et un design résistant à la transpiration.", marque: "Bose" },
  { nom: "JBL Live Pro+", description: "Des écouteurs sans fil avec une annulation active du bruit et un son de haute qualité.", marque: "JBL" },
  { nom: "Skullcandy Indy ANC", description: "Des écouteurs sans fil avec une annulation active du bruit et un son de haute qualité.", marque: "Skullcandy" },
  { nom: "Amazfit GTR 3 Pro", description: "Une montre intelligente avec des fonctionnalités de suivi de la condition physique et un design élégant.", marque: "Amazfit" },
  { nom: "Garmin Fenix 6 Pro", description: "Une montre intelligente avec des fonctionnalités avancées de suivi de la condition physique et un design robuste.", marque: "Garmin" },
  { nom: "Fitbit Sense", description: "Une montre intelligente avec des fonctionnalités avancées de suivi de la santé et de la condition physique.", marque: "Fitbit" },
  { nom: "Samsung Galaxy Watch 4", description: "Une montre intelligente avec des fonctionnalités avancées de suivi de la santé et de la condition physique.", marque: "Samsung" },
  { nom: "Apple Watch Series 7", description: "Une montre intelligente avec des fonctionnalités avancées de suivi de la santé et de la condition physique.", marque: "Apple" },
  { nom: "Huawei Watch GT 3", description: "Une montre intelligente avec des fonctionnalités avancées de suivi de la condition physique et un design élégant.", marque: "Huawei" },
  { nom: "TicWatch Pro 3", description: "Une montre intelligente avec des fonctionnalités avancées de suivi de la condition physique et un design élégant.", marque: "TicWatch" },
  { nom: "Fossil Gen 6", description: "Une montre intelligente avec des fonctionnalités avancées de suivi de la condition physique et un design élégant.", marque: "Fossil" },
  { nom: "Withings ScanWatch", description: "Une montre intelligente avec des fonctionnalités avancées de suivi de la santé et de la condition physique.", marque: "Withings" },
  { nom: "Suunto 7", description: "Une montre intelligente avec des fonctionnalités avancées de suivi de la condition physique et un design robuste.", marque: "Suunto" },
  { nom: "Polar Vantage V2", description: "Une montre intelligente avec des fonctionnalités avancées de suivi de la condition physique et un design robuste.", marque: "Polar" },
  { nom: "Coros Vertix 2", description: "Une montre intelligente avec des fonctionnalités avancées de suivi de la condition physique et un design robuste.", marque: "Coros" }
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
          name: products[v * (i + 1)].nom,
          description: products[v * (i + 1)].description,
          price: parseFloat(faker.commerce.price()),
          quantity: 110,
          brand: products[v * (i + 1)].marque,
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

  const someProducts = await Product.find();


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

      const randomProducts = someProducts.sort(() => Math.random() - 0.5).slice(0, 3);

      for (let l = 0; l < randomProducts.length; l++) {
        await db.orderDetail.create({
          data: {
            quantity: randomInt(100),
            product_name: randomProducts[l].name,
            product_description: randomProducts[l].description,
            unit_price: randomProducts[l].price,
            order_id: or.id,
            product_id: randomProducts[l].id
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
