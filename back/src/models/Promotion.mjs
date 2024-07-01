import mongoose from "../middlewares/mongooseConfig.mjs";


const promotionSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    type: String,
    created_at: { type: Date, default: Date.now },
    expiry_date: Date,
    is_one_time: Boolean,
    products_has_promotions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductHasPromotion' }],
});

const Promotion = mongoose.model('Promotion', promotionSchema);

export default Promotion;  