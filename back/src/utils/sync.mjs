import { getModel } from "./models.mjs";

export const mongoCreate = async ({ model, data }) => {
  const Model = await getModel(model);
  if (typeof Model !== "function") {
    const mainModel = Model.main;
    const main = await mainModel.findOne({
      id: data[Model.sub_key],
    });
    if (Array.isArray(main[Model.sub])) {
      main[Model.sub].push(data);
    } else {
      main[Model.sub] = data;
    }
    main.save();
    return;
  }
  const result = new Model(data);
  await result.save();
};

export const mongoUpdate = async ({ model, data, where }) => {
  const Model = await getModel(model);
  if (typeof Model !== "function") {
    const mainModel = Model.main;
    const subModelField = Model.sub;

    const subDocumentQuery = {};
    for (const key in where) {
      subDocumentQuery[`${subModelField}.${key}`] = where[key];
    }

    const mainDocument = await mainModel.findOne(subDocumentQuery);

    if (!mainDocument) {
      throw new Error("Main document not found");
    }

    if (Array.isArray(mainDocument[subModelField])) {
      const subDocIndex = mainDocument[subModelField].findIndex(
        (subDoc) => subDoc.id === data.id
      );
      if (subDocIndex >= 0) {
        mainDocument[subModelField][subDocIndex] = data;
      } else {
        throw new Error("Subdocument not found");
      }
    } else {
      mainDocument[subModelField] = data;
    }
    await mainDocument.save();
    return;
  }
  await Model.findOneAndUpdate(where, data);
};

export const mongoDelete = async ({ model, where }) => {
  const Model = await getModel(model);
  if (typeof Model !== "function") {
    const mainModel = Model.main;
    const subModelField = Model.sub;

    const subDocumentQuery = {};
    for (const key in where) {
      subDocumentQuery[`${subModelField}.${key}`] = where[key];
    }

    const mainDocument = await mainModel.findOne(subDocumentQuery);

    if (!mainDocument) {
      throw new Error("Main document not found");
    }

    if (Array.isArray(mainDocument[subModelField])) {
      mainDocument[subModelField] = mainDocument[subModelField].filter(
        (subDoc) => subDoc.id.toString() !== where.id.toString()
      );
    } else {
      mainDocument[subModelField] = undefined;
    }

    await mainDocument.save();
    return;
  }
  await Model.deleteOne(where);
};

export const mongoUpsert = async ({ model, where, create, update }) => {
  const Model = await getModel(model);
  if (typeof Model !== "function") {
    const mainModel = Model.main;
    const subModelField = Model.sub;
    
    const mainDocument = await mainModel.findOne({
      id: where[Model.sub_key],
    });

    if (!mainDocument) {
      throw new Error("Main document not found");
    }

    let subDocument;
    if (Array.isArray(mainDocument[subModelField])) {
      subDocument = mainDocument[subModelField].find((subDoc) => {
        return Object.keys(where).every((key) => subDoc[key] === where[key]);
      });

      if (subDocument) {
        Object.assign(subDocument, {
          ...subDocument,
          ...update,
        });
      } else {
        mainDocument[subModelField].push(create);
      }
    } else {
      // Handle object subdocuments
      subDocument = mainDocument[subModelField];
      if (subDocument) {
        Object.assign(mainDocument[subModelField], update);
      } else {
        mainDocument[subModelField] = create;
      }
    }

    await mainDocument.save();
    return;
  }

  const data = { ...create, ...update };

  await Model.findOneAndUpdate(where, data, {
    upsert: true,
  });
};
