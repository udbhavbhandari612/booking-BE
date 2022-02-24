import mongoose from "mongoose";
import { log } from "./logger.js";

export default function () {
  let db;
  if (process.argv[2] === "production" || process.env.NODE_ENV === "production")
    db = process.env.BOOKING_MONGODB_CONNECTION_PROD;
  else db = process.env.BOOKING_MONGODB_CONNECTION;
  log(`DB Connection request started at: ${db}`)
  mongoose.connect(db).then((val) => log(`mongodb connected on ${(process.argv[2] || process.env.NODE_ENV) || 'dev'}...`));
}
