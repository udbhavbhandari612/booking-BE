import mongoose from "mongoose";

const rushHourSchema = new mongoose.Schema(
  {
    fare: { type: String, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
  },
  { strict: false }
);

const RushHour = mongoose.model("RushHour", rushHourSchema);

export default RushHour;
