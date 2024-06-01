import { Schema, Types, model } from 'mongoose';

const passwordRecoverySchema = new Schema({
    code_validation_time: { type: Date, default: null },
    last_request: { type: Date, default: null },
    verification_code: { type: String, default: null },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true }
});

const PasswordRecovery = model('PasswordRecovery', passwordRecoverySchema);

export default PasswordRecovery;