import mongoose from "../middlewares/mongooseConfig.mjs";


const deliverySchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    address: String,
    status: { type: String, default: "En cours" },
    following_number: String,
    order_id: { type: String, required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    client_name: String,
});

const Delivery = mongoose.model('Delivery', deliverySchema);

export default Delivery;
