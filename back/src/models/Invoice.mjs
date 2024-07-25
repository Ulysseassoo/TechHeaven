import { Schema, model } from 'mongoose';
import mongoose from "../middlewares/mongooseConfig.mjs";
import { invoiceDetailSchema } from "./InvoiceDetail.mjs"


const invoiceSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  user_id: {type: String, required: true},
  order_id: {type: String, required: true},
  user_firstname:  {type: String, required: true},
  user_lastname:  {type: String, required: true},
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  paymentIntentId: { type: String, default: null },
  invoice_details:  { type: [invoiceDetailSchema], default: [] },
}, { timestamps: true });

const Invoice = model('Invoice', invoiceSchema);

export default Invoice;