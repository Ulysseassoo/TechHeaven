import { Schema, Types, model } from 'mongoose';


const orderSchema = new Schema({
    id: { type: Number, default: () => Types.ObjectId() },
    date: { type: Date, default: Date.now },
    status: String,
    total_amount: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    order_details: [{ type: Schema.Types.ObjectId, ref: 'OrderDetail' }],
    deliveries: [{ type: Schema.Types.ObjectId, ref: 'Delivery' }],
    payments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
});

const Order = model('Order', orderSchema);

export default Order;
