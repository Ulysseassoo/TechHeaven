import { Schema, Types, model } from 'mongoose';


const orderDetailSchema = new Schema({
    id: { type: Number, default: () => Types.ObjectId() },
    quantity: String,
    unit_price: String,
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
});

const OrderDetail = model('OrderDetail', orderDetailSchema);

export default OrderDetail;
