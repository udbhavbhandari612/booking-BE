import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, max: 100 },
    available: { type: Boolean, default: true },
    passenger_capacity: { type: Number, required: true, default: 0 },
    child_seat_capacity: { type: Number, required: true, default: 0 },
    luggage_capacity: { type: Number, required: true, default: 0 },
    baseprice: { type: Number, required: true, min: 0 },
    price0to10: { type: Number, required: true, min: 0 },
    price10to25: { type: Number, required: true, min: 0 },
    price25to40: { type: Number, required: true, min: 0 },
    price40to60: { type: Number, required: true, min: 0 },
    price60to80: { type: Number, required: true, min: 0 },
    price80to100: { type: Number, required: true, min: 0 },
    price100to120: { type: Number, required: true, min: 0 },
    price120to150: { type: Number, required: true, min: 0 },
    price150plus: { type: Number, required: true, min: 0 },
    photos: { type: [Object], default: [] },
  },
  { strict: false }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
