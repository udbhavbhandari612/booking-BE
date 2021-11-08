import express from "express";
import Vehicle from "../models/vehicle.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const vehicles = await Vehicle.find();
  res.send(vehicles);
});

export default router;
