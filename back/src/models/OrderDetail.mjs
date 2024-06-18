import { Schema, model } from 'mongoose';


const orderDetailSchema = new Schema({
    quantity: Number,
    unit_price: Number,
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
});

const OrderDetail = model('OrderDetail', orderDetailSchema);

export default OrderDetail;
