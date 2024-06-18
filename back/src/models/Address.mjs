import { Schema, model } from 'mongoose';


const addressSchema = new Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
  postal_code: { type: String, required: true },
  other: { type: String, default: null },
  address: { type: String, required: true },
  is_selected: { type: Boolean, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Address = model('Address', addressSchema);

export default Address;
