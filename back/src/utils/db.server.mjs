import { PrismaClient as PostgresqlClient } from "../../prisma/generated/postgresql-client/index.js"
import { PrismaClient as MongodbClient } from '../../prisma/generated/mongodb-client/index.js';


// Avoid multiple connections to the database
/** @type {PostgresqlClient} */
let postgresqlDb = new PostgresqlClient();

/** @type {MongodbClient} */
let mongoDb = new MongodbClient();


if (!global.__mongoDb && !global.__postgreDb) {
    global.__mongoDb = new MongodbClient()
    global.__postgreDb = new PostgresqlClient()
}

postgresqlDb = global.__postgreDb
mongoDb = global.__mongoDb

export { postgresqlDb, mongoDb }