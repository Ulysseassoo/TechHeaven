import mongoose from "../middlewares/mongooseConfig.mjs";

const passwordRecoverySchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    code_validation_time: { type: Date, default: null },
    last_request: { type: Date, default: null },
    verification_code: { type: String, default: null },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true }
});

const PasswordRecovery = mongoose.model('PasswordRecovery', passwordRecoverySchema);

export default PasswordRecovery;