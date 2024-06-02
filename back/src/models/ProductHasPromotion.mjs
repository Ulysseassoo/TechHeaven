import { Schema, model } from 'mongoose';

const productHasPromotionSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    promotion: { type: Schema.Types.ObjectId, ref: 'Promotion' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const ProductHasPromotion = model('ProductHasPromotion', productHasPromotionSchema);


export default ProductHasPromotion;
