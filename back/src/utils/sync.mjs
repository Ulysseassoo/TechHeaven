import { mongoDb, postgresqlDb } from "../utils/db.server.mjs";

const replaceIdWithPostgresId = (data) => {
    if (data.hasOwnProperty('id')) {
        const { id, ...rest } = data;
        return { postgresId: id, ...rest };
    }
    return data;
}

const prepareDataForUpsert = ({ where, create }) => {
    const { postgresId, user_id, ...restWhere } = where;
    const { user_id: user_id_create, ...restCreate } = create;

    const wherePostgres = {
        ...restWhere,
        user_id: postgresId,
    };

    const createPostgres = {
        ...restCreate,
        user_id: postgresId,
    };

    const whereMongo = {
        ...restWhere,
        user_id,
    };

    const createMongo = {
        ...restCreate,
        user_id: user_id_create,
    };

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

        await mongoDb[model].create({
            data: {
                ...data,
                postgresId: result.id
            },
        });

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
            where,
            select: select !== undefined ? select : undefined,
            data
        });

        await mongoDb[model].update({
            where: replaceIdWithPostgresId(where),
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
            where,
        });

        await mongoDb[model].delete({
            where: replaceIdWithPostgresId(where),
        });

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
        const { wherePostgres, createPostgres, whereMongo, createMongo } = prepareDataForUpsert({ where, create });

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