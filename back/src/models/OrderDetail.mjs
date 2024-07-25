import mongoose from "../middlewares/mongooseConfig.mjs";


export const orderDetailSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    quantity: Number,
    product_name: String,
    product_description: String,
    unit_price: Number,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    product_id: {type: String, required: true},
    order_id: { type: String, required: true  },
});

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);

export default OrderDetail;
