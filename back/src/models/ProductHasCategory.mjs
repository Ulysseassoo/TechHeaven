import mongoose from "../middlewares/mongooseConfig.mjs";


const productHasCategorySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
});

const ProductHasCategory = mongoose.model('ProductHasCategory', productHasCategorySchema);

export default ProductHasCategory;
