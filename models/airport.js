import mongoose from "mongoose";

const airportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    geometry: { type: Object },
    place_id: { type: String, required: true, unique: true },
    types: { type: [String], required: true },
    formatted_address: { type: String, required: true },
    address_components: { type: [Object], required: true },
    vicinity: { type: String, required: true },
    toll_price: { type: Number, required: true, default: 0 },
  },
  { strict: false }
);

const Airport = mongoose.model("Airport", airportSchema);

export default Airport;
