import express from "express";
import cors from "cors";
import vehicle from "../routes/vehicle.js";
import admin from "../routes/admin.js";

export default function (app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use("/api/vehicles", vehicle);
  app.use("/api/admin", admin);
}
