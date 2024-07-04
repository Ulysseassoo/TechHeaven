import mongoose from "../middlewares/mongooseConfig.mjs";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  promo: { type: Number, default: null },
  photo: { type: String, default: null },
  stock_quantity: { type: Number, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  id: { type: String, unique: true, required: true },
  lowStockAlert: { type: Boolean, default: false }
});

productSchema.statics.findToClient = async function (query) {
  const products = await this.find(query);
  return products;
};

const Product = mongoose.model('Product', productSchema);

export default Product;