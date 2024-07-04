import mongoose from "../middlewares/mongooseConfig.mjs";

const preferenceSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    alert_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Alert', required: true },
    status: { type: Boolean, required: true }
}, { _id: false });

const Preference = mongoose.model('Preference', preferenceSchema);

export default Preference;