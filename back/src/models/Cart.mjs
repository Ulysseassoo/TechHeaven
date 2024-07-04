import mongoose from "../middlewares/mongooseConfig.mjs";


const cartSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
    created_at: { type: Date, default: Date.now },
    status: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    carts_has_products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartHasProducts' }],
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
