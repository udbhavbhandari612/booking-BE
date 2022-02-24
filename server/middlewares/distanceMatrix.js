import {
  TravelMode,
  UnitSystem,
} from "@googlemaps/google-maps-services-js/dist/common.js";
import { distancematrix } from "@googlemaps/google-maps-services-js/dist/distance.js";
import _ from "lodash";

export default async function (req, res, next) {
  try {
    var distanceMatrix = await distancematrix({
      params: {
        key: process.env.GOOGLE_MAPS_API_KEY,
        origins: ["place_id:" + req.body.start],
        destinations: ["place_id:" + req.body.destination],
        mode: TravelMode.driving,
        region: "US",
        units: UnitSystem.imperial,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.error || error.message);
  }

  if (distanceMatrix.data.rows[0].elements[0].status !== "OK")
    return res.status(400).json("No route found between provided locations");

  const { destination_addresses, origin_addresses } = distanceMatrix.data;
  const { distance, duration } = distanceMatrix.data.rows[0].elements[0];

  req.payload = {
    distance,
    duration,
    destination_address: destination_addresses[0],
    origin_address: origin_addresses[0],
    ..._.pick(req.body, ["date", "time", "rideType"]),
  };
  next();
}
