import { Schema, model } from 'mongoose';


const cartHasProductsSchema = new Schema({
    cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    unit_price: String,
});

const CartHasProducts = model('CartHasProducts', cartHasProductsSchema);


export default CartHasProducts;
