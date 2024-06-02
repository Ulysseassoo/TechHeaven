import { Schema, Types, model } from 'mongoose';


const paymentSchema = new Schema({
    id: { type: Number, default: () => Types.ObjectId() },
    paid_amount: String,
    payment_method: String,
    status: String,
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
});

const Payment = model('Payment', paymentSchema);

export default Payment;
