import { Schema, model } from 'mongoose';


const deliverySchema = new Schema({
    address: String,
    status: String,
    following_number: String,
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
});

const Delivery = model('Delivery', deliverySchema);

export default Delivery;
