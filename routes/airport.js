import express from "express";
import _ from "lodash";
import Airport from "../models/airport.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const airports = await Airport.find({}, { _id: 0, __v: 0, geometry: 0 });
  res.send(airports);
});

export default router;
