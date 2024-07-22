import mongoose from "../middlewares/mongooseConfig.mjs";

const alertSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  param: { type: String, default: null },
});

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;
