import mongoose from "../middlewares/mongooseConfig.mjs";

export const productHasPromotionSchema = new mongoose.Schema({
    promotion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const ProductHasPromotion = mongoose.model('ProductHasPromotion', productHasPromotionSchema);


export default ProductHasPromotion;
