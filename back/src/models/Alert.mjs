import { Schema, Types, model } from 'mongoose';

const alertSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    param: { type: String, default: null },
    preferences: [{ type: Schema.Types.ObjectId, ref: 'Preference' }]
});

const Alert = model('Alert', alertSchema);

export default Alert;
