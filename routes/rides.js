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
  const rushHour = await RushHour.findOne();
  if (
    parseInt(payload.time.split(":")[0]) >
      parseInt(rushHour.start_time.split(":")[0]) &&
    parseInt(payload.time.split(":")[0]) <
      parseInt(rushHour.end_time.split(":")[0])
  )
    payload.rush_hour_price = parseInt(rushHour.fare);
  else payload.rush_hour_price = 0;

  payload.vehicles = vehicles.map((v) => {
    let total_fare = v.baseprice;
    if (distance > 0 && distance <= 5) total_fare += v.price0to5 * distance;
    if (distance > 5 && distance <= 10)
      total_fare += v.price0to5 * 5 + v.price5to10 * (distance - 5);
    if (distance > 10 && distance <= 15)
      total_fare +=
        v.price0to5 * 5 + v.price5to10 * 5 + v.price10to15 * (distance - 10);
    if (distance > 15)
      total_fare +=
        v.price0to5 * 5 +
        v.price5to10 * 5 +
        v.price10to15 * 5 +
        v.price15plus * (distance - 15);
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