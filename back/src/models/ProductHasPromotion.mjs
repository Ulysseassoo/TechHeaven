import mongoose from "../middlewares/mongooseConfig.mjs";

const productHasPromotionSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    promotion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const ProductHasPromotion = mongoose.model('ProductHasPromotion', productHasPromotionSchema);


export default ProductHasPromotion;
