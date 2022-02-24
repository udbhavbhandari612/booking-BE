import express from "express";
import cors from "cors";
import vehicle from "../routes/vehicle.js";
import airports from "../routes/airport.js";
import rides from "../routes/rides.js";
import bookings from "../routes/bookings.js";

export default function (app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use("/api/vehicles", vehicle);
  app.use("/api/airports", airports);
  app.use("/api/rides", rides);
  app.use("/api/bookings", bookings);
}
