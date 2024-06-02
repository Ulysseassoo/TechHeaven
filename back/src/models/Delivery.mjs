import { Schema, Types, model } from 'mongoose';


const deliverySchema = new Schema({
    id: { type: Number, default: () => Types.ObjectId() },
    address: String,
    status: String,
    following_number: String,
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
});

const Delivery = model('Delivery', deliverySchema);

export default Delivery;
