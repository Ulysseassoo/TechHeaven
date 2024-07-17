import mongoose from "../middlewares/mongooseConfig.mjs";
import Alert from "./Alert.mjs";

const addressSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
  postal_code: { type: String, required: true },
  other: { type: String, default: null },
  address: { type: String, required: true },
  is_selected: { type: Boolean, required: true },
  id: { type: String, unique: true, required: true, sparse: true },
});

const preferenceSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true, sparse: true  },
  user_id: { type: String, required: true },
  alert_id: { type: String, required: true },
  isEnabled: { type: Boolean, required: true },
  alert: { type: mongoose.Schema.Types.ObjectId, ref: 'Alert' }
});

preferenceSchema.pre('save', async function (next) {
  const alertId = this.alert_id;

  try {
    const alert = await Alert.findOne({ id: alertId });
    if (!alert) {
      throw new Error('Alert not found');
    }

    this.alert = alert._id;

    next();
  } catch (error) {
    next(error);
  }
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
  preferences: { type: [preferenceSchema], default: [] },
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
    { $unwind: "$addresses" },
    { $match: query },
    {
      $project: {
        _id: 0,
        city: "$addresses.city",
        country: "$addresses.country",
        postal_code: "$addresses.postal_code",
        other: "$addresses.other",
        address: "$addresses.address",
        is_selected: "$addresses.is_selected",
        id: "$addresses.id",
        user_id: "$id",
      },
    },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);

  const totalAddresses = await this.aggregate([
    { $unwind: "$addresses" },
    { $match: query },
    { $count: "total" },
  ]);

  const totalCount = totalAddresses[0] ? totalAddresses[0].total : 0;
  const totalPages = Math.ceil(totalCount / limit);

  return { addresses, totalCount, totalPages };
};

const User = mongoose.model("User", userSchema);

export default User;
