import { Schema, Types, model } from 'mongoose';

const userSchema = new Schema({
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
  addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
  preferences: [{ type: Schema.Types.ObjectId, ref: 'Preference' }],
  passwordRecovery: { type: Schema.Types.ObjectId, ref: 'PasswordRecovery' }
});

userSchema.method('toClient', function () {
  var obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;

  return obj;
});

userSchema.statics.findToClient = async function (query, page, limit) {
  const users = await User.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  return users.map(user => user.toClient());
};


const User = model('User', userSchema);

export default User;
