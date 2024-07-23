import mongoose from "../middlewares/mongooseConfig.mjs";
import Product from "./Product.mjs";


export const cartHasProductsSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    product_id: {type: String, required: true},
    cart_id: {type: String, required: true},
    quantity: Number,
    unit_price: String,
});

cartHasProductsSchema.pre('save', async function (next) {
    const productId = this.product_id;
    try {
      const product = await Product.findOne({ id: productId });
      if (!product) {
        throw new Error('Product not found');
      }
  
      this.product = product._id;
  
      next();
    } catch (error) {
      next(error);
    }
});

const CartHasProducts = mongoose.model('CartHasProducts', cartHasProductsSchema);

export default CartHasProducts;
