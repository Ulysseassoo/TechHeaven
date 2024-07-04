import mongoose from "../middlewares/mongooseConfig.mjs";


const cartHasProductsSchema = new mongoose.Schema({
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    unit_price: String,
});

const CartHasProducts = mongoose.model('CartHasProducts', cartHasProductsSchema);


export default CartHasProducts;
