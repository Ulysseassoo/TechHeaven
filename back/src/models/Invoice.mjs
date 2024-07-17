import { Schema, model } from 'mongoose';


const invoiceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, 
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  paymentIntentId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });


invoiceSchema.method('toClient', function() {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
});


const Invoice = model('Invoice', invoiceSchema);

export default Invoice;