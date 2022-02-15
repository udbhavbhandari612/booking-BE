import mongoose from "mongoose";
import { transporter } from "../helpers/mailTransporter.js";
import bookingConfirm from "../templates/bookingConfirm.js";
import bookingMade from "../templates/bookingMade.js";
import Vehicle from "./vehicle.js";

const bookingSchema = new mongoose.Schema({
  booking_id: {
    type: String,
    immutable: true,
    default: Date.now(),
    unique: true,
  },
  transaction_id: { type: String, unique: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  distance: { type: Object },
  duration: { type: Object },
  vehicle_details: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "Vehicle",
  },
  contact_details: { type: Object, required: true },
  price_breakup: { type: Object },
  createdAt: { type: Date, default: Date.now() },
  status: { type: String, default: "in-progress" },
  pickupdatetime: { type: Date, required: true },
  driver: { type: mongoose.SchemaTypes.ObjectId, ref: "Driver" },
  rideType: { type: String },
});

bookingSchema.methods.sendBookingConfirmMail = async function () {
  const vehicle = await Vehicle.findOne({ _id: this.vehicle_details });
  await transporter.sendMail({
    from: '"Booking App" <no-reply@leetwolf.com>',
    to: `${this.contact_details.email}`,
    subject: `Airport Limo Service - Booking Request No: ${this.booking_id}`,
    html: `${bookingMade(this, vehicle)}`,
  });
};

bookingSchema.methods.sendBookingApprovedMail = async function (driver) {
  const vehicle = await Vehicle.findOne({ _id: this.vehicle_details });
  await transporter.sendMail({
    from: '"Booking App" <no-reply@leetwolf.com>',
    to: `${this.contact_details.email}`,
    subject: `Airport Limo Service - Booking Confirmation No: ${this.booking_id}`,
    html: `${bookingConfirm(this, driver, vehicle)}`,
  });

  await transporter.sendMail({
    from: '"Booking App" <no-reply@leetwolf.com>',
    to: `${driver.email}`,
    subject: `New Booking - ${this.booking_id}`,
    html: `You have a new booking with booking# ${this.booking_id}.<br/><br/>
    <b>Passenger details</b><br/>
    ----------------------------------<br/>
    Name:                  <b>${this.contact_details.fullname}</b><br/>
    Pickup Date and Time:  <b>${this.pickupdatetime}</b><br/>
    <br/><br/>
    <b>Trip details</b><br/>
    ---------------------------------<br/>
    From:     <b>${this.from}</b><br/>
    To:       <b>${this.to}</b><br/>
    Distance: <b>${this.distance.text}</b><br/>
    Duration: <b>${this.duration.text}</b><br/>
    Vehicle:  <b>${vehicle.name}</b><br/>
    `,
  });
};

bookingSchema.methods.sendBookingRejectedMail = async function (reason = "") {
  let info = await transporter.sendMail({
    from: '"Booking App" <no-reply@leetwolf.com>',
    to: `${this.contact_details.email}`,
    subject: `Booking Rejected - ${this.booking_id}`,
    text: `Your booking with booking# ${
      this.booking_id
    } has been rejected by the admin.\n${reason && "Reason: " + reason}`, // plain text body
  });
};

export default mongoose.model("Booking", bookingSchema);
