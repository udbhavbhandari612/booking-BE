import vehicle from "../routes/admin/vehicles.js";
import airport from "../routes/admin/airports.js";
import bookings from "../routes/admin/bookings.js";
import drivers from "../routes/admin/drivers.js";
import rushHour from "../routes/admin/rushHour.js";
import auth from "../routes/admin/auth.js";

export default function (app) {
  app.use("/api/admin/auth", auth);
  app.use("/api/admin/v", vehicle);
  app.use("/api/admin/a", airport);
  app.use("/api/admin/bookings", bookings);
  app.use("/api/admin/drivers", drivers);
  app.use("/api/admin/rush-hours", rushHour);
}
