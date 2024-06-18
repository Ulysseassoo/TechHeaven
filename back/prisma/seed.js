import { PrismaClient } from '@prisma/client';
import { createData, getIdMapping } from '../src/utils/sync.mjs';
import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import Order from '../src/models/Order.mjs';
import * as dotenv from "dotenv";
import OrderDetail from '../src/models/OrderDetail.mjs';
import { faker } from '@faker-js/faker';



const prisma = new PrismaClient();

dotenv.config();

async function main() {
    const salt = bcrypt.genSaltSync(10);

    const passwordEncrypted = bcrypt.hashSync("Adminadmin12!", salt);

    await createData({
        model: 'user',
        data: {
            firstname: 'gouenji',
            lastname: "star",
            email: 'gouenji@prisma.io',
            role: "ROLE_ADMIN",
            password: passwordEncrypted,
            last_updated_password: new Date(),
            has_confirmed_account: true
        },
    });

    const user = await createData({
        model: 'user',
        data: {
            firstname: 'nandesh',
            lastname: "loka",
            email: 'nandeshlokaaaa@prisma.io',
            role: "ROLE_USER",
            password: passwordEncrypted,
            last_updated_password: new Date(),
            has_confirmed_account: true
        },
    });

    const { _id, postgresId } = await getIdMapping(user.id);

    for (let i = 0; i < 300; i++) {
        await createData({
            model: 'user',
            data: {
                firstname: faker.person.firstName(),
                lastname: faker.person.lastName(),
                email: faker.internet.email(),
                role: "ROLE_USER",
                password: passwordEncrypted,
                last_updated_password: new Date(),
                has_confirmed_account: true,
                phone: faker.phone.number(),
            },
        });
    }

    for (let i = 0; i < 10; i++) {
        const mongoResult = await Order.create({
            date: new Date(),
            status: "En attente",
            total_amount: 400 + i * 100,
            user: _id
        })

        const order_detail = await OrderDetail.create({
            quantity: 2 + 2 * 10,
            unit_price: 200 + 2 * 10,
            order: mongoResult.id,
        })

        await order_detail.save();

        mongoResult.order_details.push(order_detail);
        await mongoResult.save();

        const order = await createData({
            model: 'order',
            data: {
                date: new Date(),
                status: "En attente",
                total_amount: 400 + i * 100,
                user_id: postgresId
            },
            mongoData: {
                date: new Date(),
                status: "En attente",
                total_amount: 400 + i * 100,
                user: _id
            }
        });

        const { _id: orderMongoId, postgresId: orderPostgresId } = await getIdMapping(order.id);


        await createData({
            model: 'payment',
            data: {
                paid_amount: 500,
                payment_method: "Stripe",
                status: "Payé",
                order_id: orderPostgresId,
            },
            mongoData: {
                paid_amount: 500,
                payment_method: "Stripe",
                status: "Payé",
                order: orderMongoId,
            }
        })


        for (let j = 0; j < 4; j++) {
            await createData({
                model: 'orderDetail',
                data: {
                    quantity: 2 + i * j,
                    unit_price: 200 + i * j,
                    order_id: orderPostgresId,
                },
                mongoData: {
                    quantity: 2 + i * j,
                    unit_price: 200 + i * j,
                    order: orderMongoId,
                }
            });
        }
    }

}

async function start() {
    // let retries = 5;
    // while (retries) {
    //     try {
    //         await dropDatabase()
    //         break;
    //     } catch (error) {
    //         console.log("🚀 ~ start ~ error:", error)
    //         if (error.message === 'not primary' && retries) {
    //             retries -= 1;
    //             console.log(`Retrying... (${retries} retries left)`);
    //             await new Promise(res => setTimeout(res, 10000));
    //         } else {
    //             throw error;
    //         }
    //     }
    // }
    await main();
}

mongoose.connect(process.env.DATABASE_URL_MONGODB, {
    useNewUrlParser: true,
  })
    .then(() => {
        console.log('Connected to MongoDB')
        mongoose.connection.dropDatabase().then(() => {
            console.log("Dropped database")
            start()
            .catch((e) => {
                console.error(e);
                process.exit(1);
            })
            .finally(async () => {
                await prisma.$disconnect();
                await mongoose.connection.close();
            });
        })
        .catch((e) => {
            console.log("Didn't drop the database", e)
        })

    })
    .catch(err => console.error('MongoDB connection error:', err));