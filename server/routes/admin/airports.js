import express from "express";
import Vehicle from "../../models/vehicle.js";
import _ from "lodash";
import Airport from "../../models/airport.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const airports = await Airport.find({}, { _id: 0, __v: 0 });

  res.send(airports);
});

router.post("/", async (req, res) => {
  try {
    const a = await Airport.findOne({ place_id: req.body.place_id });
    if (a) return res.status(400).json("Airport already added");
  } catch (error) {
    res.status(400).json(`${error.name}: ${error.message}`);
  }

  const airport = new Airport({ ...req.body });

  try {
    await airport.save();
    res.status(200).json({ success: "Airport added successfully!" });
  } catch (error) {
    res.status(400).json(`${error.name}: ${error.message}`);
  }
});

router.put("/", async (req, res) => {
  const a = await Airport.findOne({ place_id: req.body.place_id });
  if (!a) return res.status(400).json("Airport not found");

  a.set({ toll_price: req.body.toll_price });

  try {
    await a.save();
    res.status(200).json({ success: "Airport updated successfully!" });
  } catch (error) {
    res.status(400).json(`${error.name}: ${error.message}`);
  }
});

router.delete("/:id", async (req, res) => {
  const airport = await Airport.findOneAndDelete({ place_id: req.params.id });
  if (!airport) return res.status(404).send("Airport not found");

  res.status(200).send(airport);
});

export default router;
