const cartSchema = new Schema({
    id: { type: Number, default: () => mongoose.Types.ObjectId() },
    created_at: { type: Date, default: Date.now },
    status: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    carts_has_products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartHasProducts' }],
});

const Cart = mongoose.model('Cart', cartSchema);


export default Cart;
