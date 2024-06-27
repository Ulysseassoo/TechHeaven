import { PrismaClient } from '@prisma/client'
import { hashPassword } from './security.mjs';

// Avoid multiple connections to the database
let db = new PrismaClient();

if (!global.__db) {
    global.__db = new PrismaClient()
}

db = global.__db


const extendedDb = db.$extends({
    name: 'db',
    query: {
        user: {
            async create({ args, query }) {
                args.data.password = hashPassword(args.data.password);
                const result = await query(args);
                return result;
            },
            async upsert({args, query}) {
                if(args.create.password || args.update.password) {
                    const passwordToHash = args.create.password ?? args.update.password;
                    args.data.password = hashPassword(passwordToHash);
                }
                const result = await query(args);
                return result;
            }
        }
    }
});

export { extendedDb as db };