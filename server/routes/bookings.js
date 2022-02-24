import express from "express";
import _ from "lodash";
import Booking from "../models/booking.js";
import makePayment from "../middlewares/makePayment.js";

const router = express.Router();

router.post("/", [makePayment], async (req, res) => {
  if (req.result.messages.resultCode === "Ok") {
    const booking = new Booking({
      booking_id: Date.now() + req.result.transactionResponse.transId,
      transaction_id: req.result.transactionResponse.transId,
      ..._.pick(req.body, ["distance", "duration", "contact_details", "rideType"]),
      price_breakup: req.result.price_breakup,
      vehicle_details: req.body.vehicle_details._id,
      createdAt: Date.now(),
      from: req.body.origin_address,
      to: req.body.destination_address,
      pickupdatetime: new Date(
        req.body.date.split("T")[0] + " " + req.body.time
      ),
    });

    try {
      const result = await booking.save();
      booking.sendBookingConfirmMail();
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(400).json(error.message);
    }
  } else {
    res.status(400).json(req.result.messages.message[0].text);
  }
});

export default router;
