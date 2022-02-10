import mongoose from "mongoose";

const rushHourSchema = new mongoose.Schema({}, { strict: false });

const RushHour = mongoose.model("RushHour", rushHourSchema);

export default RushHour;
