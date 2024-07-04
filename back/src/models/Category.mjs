import mongoose from "../middlewares/mongooseConfig.mjs";

const categorySchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

categorySchema.statics.findToClient = async function (query) {
    const categories = await this.find(query);
    return categories;
};

const Category = mongoose.model('Category', categorySchema);

export default Category;
