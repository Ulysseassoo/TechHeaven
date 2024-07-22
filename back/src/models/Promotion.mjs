import mongoose from "../middlewares/mongooseConfig.mjs";


const promotionSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    type: String,
    created_at: { type: Date, default: Date.now },
    expiry_date: Date,
    is_one_time: Boolean,
    products_has_promotions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductHasPromotion' }],
});

promotionSchema.statics.findPromotions = async function (query, page, limit) {
    const promotions = await Promotion.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    return promotions;
};

promotionSchema.statics.findToClient = async function (query) {
    const promotions = await this.find(query);
    return promotions;
};

const Promotion = mongoose.model('Promotion', promotionSchema);

export default Promotion;  