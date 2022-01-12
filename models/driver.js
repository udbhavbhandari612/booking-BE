import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  contact_number: { type: String, required: true },
  email: { type: String, required: true },
  photo_url: { type: String },
  created_at: { type: Date, default: Date.now() },
});

export default mongoose.model("Driver", driverSchema);
