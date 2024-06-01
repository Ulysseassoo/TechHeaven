import { PrismaClient } from '@prisma/client';
import { createData } from '../src/utils/sync.mjs';
import mongoose from 'mongoose';
import bcrypt from "bcryptjs";



const prisma = new PrismaClient();

async function dropDatabase() {
    try {
        await mongoose.connect(process.env.DATABASE_URL_MONGODB, {
            useNewUrlParser: true,
        })
        await mongoose.connection.dropDatabase();
        console.log("Database has been dropped.");
    } catch (error) {
        console.error("Error dropping database:", error);
    }
}

async function main() {
    await dropDatabase();

    const salt = bcrypt.genSaltSync(10);

    const passwordEncrypted = bcrypt.hashSync("Adminadmin12!", salt);

    const user1 = await createData({
        model: 'user',
        data: {
            firstname: 'gouenji',
            lastname: "star",
            email: 'gouenji@prisma.io',
            role: "ROLE_ADMIN",
            password: passwordEncrypted,
            last_updated_password: new Date(),
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await mongoose.connection.close();
    });