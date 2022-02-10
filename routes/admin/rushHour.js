import express from "express";
import _ from "lodash";
import RushHour from "../../models/rushHour.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const rushHour = await RushHour.find({ type: { $in: ["morning", "night"] } });
  res.json(rushHour);
});

router.post("/", async (req, res) => {
  const morningRushHour = _.pick(req.body, [
    "morning_start_time",
    "morning_end_time",
    "morning_fare",
  ]);
  const nightRushHour = _.pick(req.body, [
    "night_start_time",
    "night_end_time",
    "night_fare",
  ]);
  let mrh = await RushHour.findOne({ type: "morning" });
  if (mrh) mrh.set(morningRushHour);
  else mrh = new RushHour({ ...morningRushHour, type: "morning" });
  let nrh = await RushHour.findOne({ type: "night" });
  if (nrh) nrh.set(nightRushHour);
  else nrh = new RushHour({ ...nightRushHour, type: "night" });
  try {
    await mrh.save();
    await nrh.save();
    res.status(200).json("Success");
  } catch (err) {
    res.status(400).json(err);
  }
});

export default router;
