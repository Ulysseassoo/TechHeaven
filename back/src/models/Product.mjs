import mongoose from "../middlewares/mongooseConfig.mjs";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  promotion: { type: Number, default: null },
  promotion_type: { type: String, default: null },
  quantity: { type: Number, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  id: { type: String, unique: true, required: true },
});

productSchema.statics.findToClient = async function (query, page, limit) {
  const products = await this.find(query)
  .limit(limit * 1)
  .skip((page - 1) * limit)
  .exec();
  return products;
};

const Product = mongoose.model('Product', productSchema);

export default Product;