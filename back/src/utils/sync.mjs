import { mongoDb, postgresqlDb } from "../utils/db.server.mjs";

const replaceIdWithPostgresId = (data) => {
    if (data.hasOwnProperty('id')) {
        const { id, ...rest } = data;
        return { postgresId: id, ...rest };
    }
    return data;
}

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
        const result = await postgresqlDb[model].upsert({
            where,
            create,
            update
        });

        await mongoDb[model].upsert({
            where: replaceIdWithPostgresId(where),
            create,
            update
        });

        return result;
    } catch (error) {
        throw error
    }
}