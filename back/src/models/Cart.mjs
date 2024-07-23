import mongoose from "../middlewares/mongooseConfig.mjs";
import { cartHasProductsSchema } from "./CartHasProduct.mjs"


const cartSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    total: {type: Number, defaul: 0},
    promotion: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    carts_has_products: { type: [cartHasProductsSchema], default: [] },
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
