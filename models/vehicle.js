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
    price0to5: { type: Number, required: true, min: 0 },
    price5to10: { type: Number, required: true, min: 0 },
    price10to15: { type: Number, required: true, min: 0 },
    price15plus: { type: Number, required: true, min: 0 },
    photos: { type: [Object], default: [] },
  },
  { strict: false }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
