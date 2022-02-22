import mongoose from "mongoose";
import { log } from "./logger.js";

export default function () {
  let db;
  if (process?.argv[2] === "production")
    db = process.env.BOOKING_MONGODB_CONNECTION_PROD;
  else db = process.env.BOOKING_MONGODB_CONNECTION;
  mongoose.connect(db).then((val) => log(`mongodb connected on ${process.argv[2] || 'dev'}...`));
}
