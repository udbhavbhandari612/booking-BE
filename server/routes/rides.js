import express from "express";
import _ from "lodash";
import distanceMatrix from "../middlewares/distanceMatrix.js";
import Airport from "../models/airport.js";
import RushHour from "../models/rushHour.js";
import Vehicle from "../models/vehicle.js";

const router = express.Router();

router.post("/", [distanceMatrix], async (req, res) => {
  let place_id, airport;
  if (req.body.rideType === "from-airport") place_id = req.body.start;
  if (req.body.rideType === "to-airport") place_id = req.body.destination;

  const vehicles = await Vehicle.find({}, { __v: 0 });
  if (place_id)
    airport = await Airport.findOne({ place_id }, { _id: 0, __v: 0 });

  const payload = { ...req.payload };

  const distance = Math.floor(payload.distance.value / 1609.34);

  payload.toll_price = airport?.toll_price || 0;

  //set rush hour fare
  const morningRushHour = await RushHour.findOne({ type: "morning" });
  const nightRushHour = await RushHour.findOne({ type: "night" });
  if (
    parseInt(payload.time.split(":")[0]) >=
      parseInt(morningRushHour.morning_start_time.split(":")[0]) &&
    parseInt(payload.time.split(":")[0]) <=
      parseInt(morningRushHour.morning_end_time.split(":")[0]) &&
    payload.time.includes("AM")
  )
    payload.morning_rush_hour_price = parseInt(morningRushHour.morning_fare);
  else payload.morning_rush_hour_price = 0;

  if (
    parseInt(payload.time.split(":")[0]) >=
      parseInt(nightRushHour.night_start_time.split(":")[0]) &&
    parseInt(payload.time.split(":")[0]) <=
      parseInt(nightRushHour.night_end_time.split(":")[0]) &&
    payload.time.includes("PM")
  )
    payload.night_rush_hour_price = parseInt(nightRushHour.night_fare);
  else payload.night_rush_hour_price = 0;

  payload.vehicles = vehicles.map((v) => {
    let total_fare = v.baseprice;
    if (distance > 0 && distance <= 10) total_fare += v.price0to10 * distance;
    else if (distance > 10 && distance <= 25)
      total_fare += v.price0to10 * 10 + v.price10to20 * (distance - 10);
    else if (distance > 25 && distance <= 40)
      total_fare +=
        v.price0to10 * 10 +
        v.price10to25 * 15 +
        v.price25to40 * (distance - 25);
    else if (distance > 40 && distance <= 60)
      total_fare +=
        v.price0to10 * 10 +
        v.price10to25 * 15 +
        v.price25to40 * 15 +
        v.price40to60 * (distance - 40);
    else if (distance > 60 && distance <= 80)
      total_fare +=
        v.price0to10 * 10 +
        v.price10to25 * 15 +
        v.price25to40 * 15 +
        v.price40to60 * 20 +
        v.price60to80 * (distance - 60);
    else if (distance > 80 && distance <= 100)
      total_fare +=
        v.price0to10 * 10 +
        v.price10to25 * 15 +
        v.price25to40 * 15 +
        v.price40to60 * 20 +
        v.price60to80 * 20 +
        v.price80to100 * (distance - 80);
    else if (distance > 100 && distance <= 120)
      total_fare +=
        v.price0to10 * 10 +
        v.price10to25 * 15 +
        v.price25to40 * 15 +
        v.price40to60 * 20 +
        v.price60to80 * 20 +
        v.price80to100 * 20 +
        v.price100to120 * (distance - 100);
    else if (distance > 120 && distance <= 150)
      total_fare +=
        v.price0to10 * 10 +
        v.price10to25 * 15 +
        v.price25to40 * 15 +
        v.price40to60 * 20 +
        v.price60to80 * 20 +
        v.price80to100 * 20 +
        v.price100to120 * 20 +
        v.price120to150 * (distance - 120);
    else if (distance > 150)
      total_fare +=
        v.price0to10 * 10 +
        v.price10to25 * 15 +
        v.price25to40 * 15 +
        v.price40to60 * 20 +
        v.price60to80 * 20 +
        v.price80to100 * 20 +
        v.price100to120 * 20 +
        v.price120to150 * 30 +
        v.price150plus * (distance - 150);
    return {
      total_fare,
      ..._.pick(v, [
        "_id",
        "id",
        "name",
        "photos",
        "passenger_capacity",
        "child_seat_capacity",
        "luggage_capacity",
      ]),
    };
  });
  res.send(payload);
});

export default router;
