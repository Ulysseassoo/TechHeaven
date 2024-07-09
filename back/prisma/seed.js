import { PrismaClient } from '@prisma/client';
import mongoose from '../src/middlewares/mongooseConfig.mjs';
import * as dotenv from "dotenv";
import { faker } from '@faker-js/faker';
import moment from "moment";
import { db } from '../src/utils/db.server.mjs';


const prisma = new PrismaClient();

dotenv.config();

const getRandomDateBetween2023And2024 = () => {
    const start = moment('2023-01-01').startOf('year').valueOf();
    const end = moment('2024-12-31').endOf('year').valueOf();
    
    const randomTimestamp = Math.floor(Math.random() * (end - start + 1)) + start;
    
    return moment(randomTimestamp);
  }

async function main() {
    const globalPassword = "Adminadmin12"

    await db.user.create({
        data: {
            firstname: 'gouenji',
            lastname: "star",
            email: 'gouenji@prisma.io',
            role: "ROLE_ADMIN",
            password: globalPassword,
            last_updated_password: new Date(),
            has_confirmed_account: true
        },
    });

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
                }
            })
        }

    }
    
    setTimeout(async () => {
        console.log("Seeding completed")
        await prisma.$disconnect();
        await mongooseDatabase.close();
    }, 5000);
}

async function start() {
    await main();
}

mongoose.connect(process.env.DATABASE_URL_MONGODB, {
    useNewUrlParser: true,
  })
const mongooseDatabase = mongoose.connection;

mongooseDatabase.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongooseDatabase.once('open', () => {
  console.log('Connected to MongoDB successfully');
  // Start your application logic here or trigger it to ensure it starts after the connection is established
  mongooseDatabase.dropDatabase().then(() => {
        console.log("Dropped database")
        start()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
    })
    .catch((e) => {
        console.log("Didn't drop the database", e)
    })
});