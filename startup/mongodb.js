import mongoose from "mongoose";
import { log } from "./logger.js";

export default function () {
  const db = process.env.BOOKING_MONGODB_CONNECTION_PROD;
  mongoose
    .connect(db)
    .then((val) => log(`mongodb connected...`));
}
