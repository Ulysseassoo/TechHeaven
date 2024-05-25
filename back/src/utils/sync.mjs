import { mongoDb, postgresqlDb } from "../utils/db.server.mjs";

const isMongoId = (id) => {
    const objectIdRegex = /^[a-f\d]{24}$/i;
    return objectIdRegex.test(id);
};

const isPostgresId = (id) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(id);
};

export const getIdMapping = async (id) => {
    try {
        const where = {
            postgresId: isMongoId(id) ? undefined : id,
            mongoId: isMongoId(id) ? id : undefined
        }

        const idMapping = await mongoDb.idMapping.findUnique({
            where
        });

        if (!idMapping) {
            throw Error("Utilisateur inexistant")
        }

        return idMapping;
    } catch (error) {
        throw error
    }
};

const replaceIdWithPostgresId = (data, model) => {
    if (data.hasOwnProperty('id') && model === "user") {
        const { id, ...rest } = data;
        return { postgresId: id, ...rest };
    }
    return data;
}

const formatWhereObject = async (where, databaseName) => {
    const formattedWhere = { ...where };

    for (const key of Object.keys(where)) {
        if (key !== "email" && where[key]) {
            const idMapping = await getIdMapping(where[key]);
            if (idMapping) {
                formattedWhere[key] = databaseName === "mongo" ? idMapping.mongoId : idMapping.postgresId;
            }
        }
    }
    return formattedWhere;
}

const formatCreateObject = async (create, databaseName) => {
    const formattedCreate = { ...create };

    for (const key of Object.keys(create)) {
        if (key.includes("id") && create[key] && (isPostgresId(create[key]) || isMongoId(create[key]))) {
            const idMapping = await getIdMapping(create[key]);
            if (idMapping) {
                formattedCreate[key] = databaseName === "mongo" ? idMapping.mongoId : idMapping.postgresId;
            }
        }
    }
    return formattedCreate;
}

const prepareDataForUpsert = async ({ where, create }) => {
    const wherePostgres = await formatWhereObject(where, "postgres")

    const createPostgres = await formatCreateObject(create, "postgres")

    const whereMongo = await formatWhereObject(where, "mongo")

    const createMongo = await formatCreateObject(create, "mongo")

    return {
        wherePostgres,
        createPostgres,
        whereMongo,
        createMongo,
    };
};

export const createData = async ({
    model,
    data,
    select,
}) => {
    try {
        const result = await postgresqlDb[model].create({
            select,
            data
        });

        const mongoResult = await mongoDb[model].create({
            data
        });

        await mongoDb.idMapping.create({
            data: {
                postgresId: result.id,
                mongoId: mongoResult.id
            }
        })

        return result;

    } catch (error) {
        throw error
    }
}

export const updateData = async ({
    model,
    where,
    select,
    data,
}) => {
    try {
        const result = await postgresqlDb[model].update({
            where: await formatWhereObject(where, "postgres"),
            select: select !== undefined ? select : undefined,
            data
        });

        await mongoDb[model].update({
            where: await formatWhereObject(where, "mongo"),
            data
        });

        return result;
    } catch (error) {
        throw error
    }
}

export const deleteData = async ({
    model,
    where,
}) => {
    try {
        await postgresqlDb[model].delete({
            where: await formatWhereObject(where, "postgres"),
        });

        await mongoDb[model].delete({
            where: await formatWhereObject(where, "mongo"),
        });

        await mongoDb.idMapping.delete({
            where: {
                mongoId: where.id
            }
        })
    } catch (error) {
        throw error
    }
}

export const upsertData = async ({
    model,
    where,
    create,
    update,
}) => {
    try {
        const { wherePostgres, createPostgres, whereMongo, createMongo } = await prepareDataForUpsert({ where, create });

        const result = await postgresqlDb[model].upsert({
            where: wherePostgres,
            create: createPostgres,
            update
        });

        await mongoDb[model].upsert({
            where: whereMongo,
            create: createMongo,
            update
        });

        return result;
    } catch (error) {
        throw error
    }
}