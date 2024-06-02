import { Schema, model } from 'mongoose';

const productHasCategorySchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
});

const ProductHasCategory = model('ProductHasCategory', productHasCategorySchema);

export default ProductHasCategory;
