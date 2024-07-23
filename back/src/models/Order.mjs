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
  deliveries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Delivery" }],
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
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

orderSchema.method("toClient", function () {
  var obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;

  return obj;
});

orderSchema.statics.findToClient = async function (query, page, limit) {
  const orders = await Order.find(query)
    .populate({
      path: "user",
      select: "toClient",
    })
    .populate("payments")
    .populate("order_details")
    .populate("deliveries")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  return orders.map((order) => order.toClient());
};

const Order = mongoose.model("Order", orderSchema);

export default Order;
