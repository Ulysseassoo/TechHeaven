import mongoose from "../middlewares/mongooseConfig.mjs";
import { orderDetailSchema } from "./OrderDetail.mjs";
import User from "./User.mjs";

const orderSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  created_at: { type: Date, default: Date.now },
  status: { type: String, default: "En cours" },
  total_amount: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  user_id: { type: String, required: true },
  order_details: { type: [orderDetailSchema], default: [] },
});

orderSchema.pre('save', async function (next) {

  if(!this.user_id) {
    next()
    return
  }
  
  try {
    const user = await User.findOne({ id: this.user_id });
    if (!user) {
      throw new Error('User not found');
    }

    this.user = user._id;

    next();
  } catch (error) {
    next(error);
  }
});

orderSchema.statics.findToClient = async function (query, page, limit) {
  const orders = await Order.find(query)
    .populate("user")
    .populate("order_details")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  return orders;
};

const Order = mongoose.model("Order", orderSchema);

export default Order;
