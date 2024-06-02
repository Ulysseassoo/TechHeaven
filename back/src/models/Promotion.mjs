import { Schema, model, Types } from 'mongoose';


const promotionSchema = new Schema({
    id: { type: Number, default: () => Types.ObjectId() },
    type: String,
    created_at: { type: Date, default: Date.now },
    expiry_date: Date,
    is_one_time: Boolean,
    products_has_promotions: [{ type: Schema.Types.ObjectId, ref: 'ProductHasPromotion' }],
});

const Promotion = model('Promotion', promotionSchema);

export default Promotion;  