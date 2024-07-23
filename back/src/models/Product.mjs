import mongoose from "../middlewares/mongooseConfig.mjs";
import Category, { categorySchema } from "./Category.mjs";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  promotion: { type: Number, default: null },
  promotion_type: { type: String, default: null },
  quantity: { type: Number, required: true },
  categoryId: { type: String, default: null },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false, default: null },
  id: { type: String, unique: true, required: true },
});

productSchema.pre('save', async function (next) {

  if(!this.categoryId) {
    next()
    return
  }
  
  try {
    const category = await Category.findOne({ id: this.categoryId });
    if (!category) {
      throw new Error('Category not found');
    }

    this.category = category._id;

    next();
  } catch (error) {
    next(error);
  }
});

productSchema.statics.findToClient = async function (query, page, limit) {
  const products = await this.find(query)
  .populate("category")
  .limit(limit * 1)
  .skip((page - 1) * limit)
  .exec();
  return products;
};

const Product = mongoose.model('Product', productSchema);

export default Product;