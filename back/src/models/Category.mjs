import mongoose from "../middlewares/mongooseConfig.mjs";

export const categorySchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
});

categorySchema.statics.findToClient = async function (query) {
    const categories = await this.find(query);
    return categories;
};

const Category = mongoose.model('Category', categorySchema);

export default Category;
