import mongoose from "../middlewares/mongooseConfig.mjs";


const orderSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
    date: { type: Date, default: Date.now },
    status: String,
    total_amount: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    order_details: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderDetail' }],
    deliveries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' }],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
});

orderSchema.method('toClient', function () {
    var obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;

    return obj;
});


orderSchema.statics.findToClient = async function (query, page, limit) {
    const orders = await Order.find(query)
        .populate({
            path: 'user',
            select: 'toClient'
        })
        .populate('payments')
        .populate('order_details')
        .populate('deliveries')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
    return orders.map(order => order.toClient());
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
