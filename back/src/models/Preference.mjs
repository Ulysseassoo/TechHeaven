import { Schema, model } from 'mongoose';

const preferenceSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    alert_id: { type: Schema.Types.ObjectId, ref: 'Alert', required: true },
    status: { type: Boolean, required: true }
}, { _id: false });

const Preference = model('Preference', preferenceSchema);

export default Preference;