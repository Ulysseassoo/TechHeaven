import { Schema, Types, model } from 'mongoose';

const cartSchema = new Schema({
    created_at: { type: Date, default: Date.now },
    status: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    carts_has_products: [{ type: Schema.Types.ObjectId, ref: 'CartHasProducts' }],
});

const Cart = model('Cart', cartSchema);

export default Cart;
