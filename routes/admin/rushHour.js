import express from "express";
import _ from "lodash";
import RushHour from "../../models/rushHour.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const rushHour = await RushHour.findOne();
  res.json(rushHour);
});

router.post("/", async (req, res) => {
  const rushHour = _.pick(req.body, ["start_time", "end_time", "fare"]);
  let rh = await RushHour.findOne();
  if (rh) rh.set(rushHour);
  else rh = new RushHour(rushHour);
  try {
    await rh.save();
    res.status(200).json("Success");
  } catch (err) {
    res.status(400).json(err);
  }
});

export default router;
