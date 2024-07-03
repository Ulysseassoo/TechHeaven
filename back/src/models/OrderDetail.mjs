import mongoose from "../middlewares/mongooseConfig.mjs";


const orderDetailSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
    quantity: Number,
    unit_price: Number,
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
});

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);

export default OrderDetail;