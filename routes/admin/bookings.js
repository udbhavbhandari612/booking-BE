import express from "express";
import _ from "lodash";
import refundPayment from "../../middlewares/refundPayment.js";
import Booking from "../../models/booking.js";
import Driver from "../../models/driver.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let query = {
    status: req.query.filter,
  };
  const bookings = await Booking.find(req.query.filter ? query : {}, {
    __v: 0,
  }).populate("vehicle_details");

  res.send(bookings);
});

router.post("/approve", async (req, res) => {
  const booking = await Booking.findOne({ booking_id: req.body.booking_id });
  const driver = await Driver.findOne({ _id: req.body.driver_id });
  booking.status = "approved";
  booking.driver = req.body.driver_id;
  try {
    booking.sendBookingApprovedMail(driver);
    booking.save();
    res.status(200).json("success");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

router.post("/reject", [refundPayment], async (req, res) => {
  const booking = await Booking.findOne({ booking_id: req.body.booking_id });
  booking.status = "rejected";
  try {
    booking.sendBookingRejectedMail(req.body.reason);
    await booking.save();
    res.status(200).json("success");
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

export default router;
