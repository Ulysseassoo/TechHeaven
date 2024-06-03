import IdMapping from "../models/IdMapping.mjs";
import { db } from "../utils/db.server.mjs";
import { getModel } from "./models.mjs";

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
            _id: isMongoId(id) ? id : undefined
        }

        const validWhere = Object.keys(where).reduce((obj, key) => {
            if (where[key] !== undefined) {
                obj[key] = where[key];
            }
            return obj;
        }, {});

        const idMapping = await IdMapping.findOne(validWhere);

        if (!idMapping) {
            throw Error("Utilisateur inexistant")
        }

        return idMapping;
    } catch (error) {
        throw error
    }
};

const formatWhereObject = async (where, databaseName) => {
    const formattedWhere = { ...where };

    for (const key of Object.keys(where)) {
        if (key !== "email" && where[key]) {
            const idMapping = await getIdMapping(where[key]);
            if (idMapping) {
                formattedWhere[key] = databaseName === "mongo" ? idMapping._id : idMapping.postgresId;
            }

            if (key === "id" && databaseName === "mongo") {
                formattedWhere["_id"] = formattedWhere[key];
                delete formattedWhere[key];
            }
        }
    }
    return formattedWhere;
}


async function upsertMongo(model, where, create, update) {
    const Model = await getModel(model);

    const data = { ...create, ...update };

    await Model.findOneAndUpdate(where, data, {
        upsert: true,
    });

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

/**
 * Function to create a new record in the specified model.
 * It also creates a corresponding record in the MongoDB database and updates the IdMapping.
 *
 * @param {Object} params - The parameters for creating a new record.
 * @param {string} params.model - The name of the model to create the record in.
 * @param {Object} params.data - The data to be inserted into the model.
 * @param {Object} params.select - The fields to be selected from the created record.
 *
 * @returns {Promise<Object>} - A promise that resolves to the created record.
 *
 * @throws {Error} - If any error occurs during the creation process.
 */
export const createData = async ({
    model,
    data,
    select,
}) => {
    try {
        const Model = await getModel(model);

        const result = await db[model].create({
            select,
            data
        });

        const mongoResult = new Model(data)
        await mongoResult.save();

        const idMapping = new IdMapping({ postgresId: result.id, _id: mongoResult.id });
        await idMapping.save();

        return result;

    } catch (error) {
        throw error
    }
}

/**
 * Function to update a record in the specified model.
 * It also updates the corresponding record in the MongoDB database.
 *
 * @param {Object} params - The parameters for updating a record.
 * @param {string} params.model - The name of the model to update the record in.
 * @param {Object} params.where - The conditions to identify the record to update.
 * @param {Object} params.select - The fields to be selected from the updated record.
 * @param {Object} params.data - The data to be updated in the record.
 *
 * @returns {Promise<Object>} - A promise that resolves to the updated record.
 *
 * @throws {Error} - If any error occurs during the update process.
 */
export const updateData = async ({
    model,
    where,
    select,
    data,
}) => {
    try {
        const Model = await getModel(model);

        const result = await db[model].update({
            where: await formatWhereObject(where, "postgres"),
            select: select !== undefined ? select : undefined,
            data
        });

        const whereMongo = await formatWhereObject(where, "mongo");
        await Model.findOneAndUpdate(whereMongo, data);

        return result;
    } catch (error) {
        throw error
    }
}

/**
 * Function to delete a record from the specified model.
 * It also deletes the corresponding record from the MongoDB database and in the IdMapping.
 *
 * @param {Object} params - The parameters for deleting a record.
 * @param {string} params.model - The name of the model to delete the record from.
 * @param {Object} params.where - The conditions to identify the record to delete.
 *
 * @returns {Promise<void>} - A promise that resolves when the deletion is complete.
 *
 * @throws {Error} - If any error occurs during the deletion process.
 */
export const deleteData = async ({
    model,
    where,
}) => {
    try {

        const Model = await getModel(model);
        await db[model].delete({
            where: await formatWhereObject(where, "postgres"),
        });

        const whereMongo = await formatWhereObject(where, "mongo");

        await Model.deleteOne(whereMongo);

        await IdMapping.deleteOne({
            postgresId: where.id
        });
    } catch (error) {
        throw error
    }
}

/**
 * Function to upsert (update or insert) a record in the specified model.
 *
 * @param {Object} params - The parameters for upserting a record.
 * @param {string} params.model - The name of the model to upsert the record in.
 * @param {Object} params.where - The conditions to identify the record to upsert.
 * @param {Object} params.create - The data to be inserted if the record does not exist.
 * @param {Object} params.update - The data to be updated if the record exists.
 *
 * @returns {Promise<Object>} - A promise that resolves to the upserted record.
 *
 * @throws {Error} - If any error occurs during the upsert process.
 */
export const upsertData = async ({
    model,
    where,
    create,
    update,
}) => {
    try {
        const { wherePostgres, createPostgres, whereMongo, createMongo } = await prepareDataForUpsert({ where, create });

        const result = await db[model].upsert({
            where: wherePostgres,
            create: createPostgres,
            update
        });

        await upsertMongo(model, whereMongo, createMongo, update);

        return result;
    } catch (error) {
        throw error
    }
}