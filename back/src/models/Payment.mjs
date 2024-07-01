import mongoose from "../middlewares/mongooseConfig.mjs";


const paymentSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    paid_amount: Number,
    payment_method: String,
    status: String,
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
