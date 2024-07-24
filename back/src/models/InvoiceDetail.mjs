import mongoose from "../middlewares/mongooseConfig.mjs";

export const invoiceDetailSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    quantity: Number,
    product_name: String,
    product_description: String,
    unit_price: Number,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    product_id: {type: String, required: true},
    invoice_id: { type: String, required: true  },
});

const InvoiceDetail = mongoose.model('InvoiceDetail', invoiceDetailSchema);

export default InvoiceDetail;
