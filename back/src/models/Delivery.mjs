import mongoose from "../middlewares/mongooseConfig.mjs";


const deliverySchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
    address: String,
    status: String,
    following_number: String,
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
});

const Delivery = mongoose.model('Delivery', deliverySchema);

export default Delivery;
