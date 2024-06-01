import { Schema, Types, model } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  promo: { type: Number, default: null },
  photo: { type: String, default: null },
  stock_quantity: { type: Number, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  lowStockAlert: { type: Boolean, default: false }
});

productSchema.method('toClient', function () {
  var obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;

  return obj;
});

productSchema.statics.findToClient = async function (query) {
  const products = await this.find(query);
  return products.map(product => product.toClient());
};

const Product = model('Product', productSchema);

export default Product;