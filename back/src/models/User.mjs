import mongoose from "../middlewares/mongooseConfig.mjs";

const addressSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
  postal_code: { type: String, required: true },
  other: { type: String, default: null },
  address: { type: String, required: true },
  is_selected: { type: Boolean, required: true },
  id: { type: String, unique: true, required: true, sparse: true },
});

const passwordRecoverySchema = new mongoose.Schema({
  code_validation_time: { type: Date, default: null },
  last_request: { type: Date, default: null },
  verification_code: { type: String, default: null },
  id: { type: String, unique: true, required: true },
});

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  firstname: { type: String, default: null },
  lastname: { type: String, default: null },
  email: { type: String, unique: true, required: true },
  phone: { type: String, default: null },
  password: { type: String, required: true },
  role: { type: String, required: true },
  has_confirmed_account: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
  last_updated_password: { type: Date, default: null },
  number_connexion_attempts: { type: Number, default: 0 },
  blocked_until: { type: Date, default: null },
  addresses: { type: [addressSchema], default: [] },
  preferences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Preference' }],
  passwordRecovery: {
    type: passwordRecoverySchema,
    default: null,
  },
});

userSchema.statics.findToClient = async function (query, page, limit) {
  const users = await User.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  return users;
};

userSchema.statics.findAddresses = async function (query, page, limit) { 
  const addresses = await this.aggregate([
    { $unwind: '$addresses' },
    { $match: query },
    { $project: { 
      user_id: '$_id',
      'addresses._id': 0,
      addresses: 1
     } },
    { $replaceRoot: { newRoot: '$addresses' } },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  ]);

  const totalAddresses = await this.aggregate([
    { $unwind: '$addresses' },
    { $match: query },
    { $count: 'total' }
  ]);

  const totalCount = totalAddresses[0] ? totalAddresses[0].total : 0;
  const totalPages = Math.ceil(totalCount / limit);

  return { addresses, totalCount, totalPages };
}


const User = mongoose.model('User', userSchema);

export default User;
