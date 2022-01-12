import mongoose from "mongoose";
import { transporter } from "../helpers/mailTransporter.js";
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
  pickup_datettime: { type: Date, required: true },
  driver: { type: mongoose.SchemaTypes.ObjectId, ref: "Driver" },
});

bookingSchema.methods.sendBookingConfirmMail = async function () {
  await transporter.sendMail({
    from: '"Booking App" <no-reply@leetwolf.com>',
    to: `${this.contact_details.email}`,
    subject: "Booking Confirmed",
    text: `Your booking has been made succesfully with booking# ${this.booking_id} and transaction# ${this.transaction_id}`, // plain text body
  });
};

bookingSchema.methods.sendBookingApprovedMail = async function (driver) {
  await transporter.sendMail({
    from: '"Booking App" <no-reply@leetwolf.com>',
    to: `${this.contact_details.email}`,
    subject: `Booking Approved - ${this.booking_id}`,
    html: `Your booking with booking# ${this.booking_id} has been approved successfully.<br/><br/>
    Driver details<br/>
    ------------------------------<br/>
    Name:       <b>${driver.name}</b><br/>
    Contact No: <b>${driver.contact_number}</b><br/>
    Email:      <b>${driver.email}</b><br/>
    `,
  });

  const vehicle = await Vehicle.findOne({ _id: this.vehicle_details }, [
    "name",
  ]);
  await transporter.sendMail({
    from: '"Booking App" <no-reply@leetwolf.com>',
    to: `${driver.email}`,
    subject: `New Booking - ${this.booking_id}`,
    html: `Your have a new booking with booking# ${this.booking_id}.<br/><br/>
    <b>Passenger details</b><br/>
    ----------------------------------<br/>
    Name:                  <b>${this.contact_details.fullname}</b><br/>
    Contact No:            <b>${this.contact_details.phone}</b><br/>
    Email:                 <b>${this.contact_details.email}</b><br/>
    Pickup Date and Time:  <b>${this.pickup_datettime}</b><br/>
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
