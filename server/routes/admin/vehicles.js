import express from "express";
import Vehicle from "../../models/vehicle.js";
import _ from "lodash";
import upload from "../../startup/storage.js";
import fs from "fs";

const router = express.Router();

router.get("/", async (req, res) => {
  let vehicles = [];
  if (req.query.q)
    vehicles = await Vehicle.find({
      name: { $regex: new RegExp(req.query.q, "i") },
    });
  else vehicles = await Vehicle.find();
  res.send(vehicles);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const vehicle = await Vehicle.findOne({ id: id });
  if (!vehicle) return res.status(404).send("Vehicle not found");
  res.status(200).send(vehicle);
});

router.post("/", [upload.array("images")], async (req, res) => {
  const data = _.pick(req.body, [
    "name",
    "passenger_capacity",
    "child_seat_capacity",
    "luggage_capacity",
    "baseprice",
    "price0to10",
    "price10to25",
    "price25to40",
    "price40to60",
    "price60to80",
    "price80to100",
    "price100to120",
    "price120to150",
    "price150plus",
  ]);

  const id = data.name
    .trim()
    .split(" ")
    .map((v) => v.toLowerCase())
    .join("_");

  const temp = await Vehicle.findOne({ id });
  if (temp) return res.status(400).json("Vehicle already exists");

  const vehicle = new Vehicle({
    ...data,
    id,
  });

  if (req.files.length > 0) {
    const photos = [];
    req.files.forEach((v) => {
      let path = `http://${req.hostname}:4000${v.destination
        .replace(`.`, "")
        .replace("/public", "")}${v.filename}`;
      photos.push({ ..._.pick(v, ["filename", "size", "mimetype"]), path });
    });
    vehicle.set("photos", photos);
  }
  try {
    await vehicle.save();
    res.status(200).json({ success: "Vehicle added successfully!" });
  } catch (error) {
    res.status(400).json(`${error.name}: ${error.message}`);
  }
});

router.put("/", upload.array("images"), async (req, res) => {
  const vehicle = await Vehicle.findOne({ id: req.body.id });
  if (!vehicle) return res.status(404).send({ error: "Vehicle not found" });

  const data = _.omit(req.body, ["id"]);
  data.photos = JSON.parse(data.photos);

  if (data.photos.length != vehicle.photos.length) {
    vehicle.photos.forEach((photo) => {
      if (!data.photos.find((e) => e.filename === photo.filename))
        fs.rmSync(`./public/images/${vehicle.id}/${photo.filename}`);
    });
  }

  vehicle.set({ ...data });

  if (req.files.length > 0) {
    const photos = data.photos;
    req.files.forEach((v) => {
      let path = `http://${req.hostname}:4000${v.destination
        .replace(`.`, "")
        .replace("/public", "")}${v.filename}`;
      photos.push({ ..._.pick(v, ["filename", "size", "mimetype"]), path });
    });
    vehicle.set("photos", photos);
  }
  await vehicle.save();
  res.status(200).send({ success: vehicle.name + " updated successfully" });
});

router.delete("/:id", async (req, res) => {
  const vehicle = await Vehicle.findOneAndDelete({ id: req.params.id });
  if (!vehicle) return res.status(404).send("Vehicle not found");
  if (vehicle.photos.length > 0) {
    vehicle.photos.forEach((e) =>
      fs.rmSync(`./public/images/${vehicle.id}/${e.filename}`)
    );
    fs.rmdirSync(`./public/images/${vehicle.id}`);
  }
  res.status(200).send(vehicle);
});

export default router;