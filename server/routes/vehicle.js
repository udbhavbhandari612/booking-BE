import express from "express";
import Vehicle from "../models/vehicle.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.send(vehicles);
  } catch (error) {
    throw new Error(error);
  }
});

export default router;
