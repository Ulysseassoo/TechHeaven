import mongoose from "../middlewares/mongooseConfig.mjs";
import Product from "./Product.mjs";


const stockHistorySchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    date: { type: Date, required: true },
    quantity: { type: Number, required: true },
    product_id: { type: String, default: null },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false, default: null },
});


stockHistorySchema.pre('save', async function (next) {

    if(!this.product_id) {
      next()
      return
    }
    
    try {
      const product = await Product.findOne({ id: this.product_id });
      if (!product) {
        throw new Error('Product not found');
      }
  
      this.product = product._id;
  
      next();
    } catch (error) {
      next(error);
    }
});

const StockHistory = mongoose.model('StockHistory', stockHistorySchema);

export default StockHistory;