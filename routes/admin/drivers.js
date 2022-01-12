import express from "express";
import Driver from "../../models/driver.js";
import _ from "lodash";
import driverStorage from "../../startup/driverStorage.js";
import fs from "fs";

const router = express.Router();

router.get("/", async (req, res) => {
  const drivers = await Driver.find();
  res.send(drivers);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const driver = await Driver.findOne({ id });
  if (!driver) return res.status(404).send("Driver not found");
  res.status(200).send(driver);
});

router.post("/", [driverStorage.single("image")], async (req, res) => {
  let data = _.pick(req.body, ["name", "age", "contact_number", "email"]);

  // const temp = await Driver.findOne({ id: req.body._id });
  // if (temp) return res.status(400).json("Driver already exists");
  if (req.file) {
    const { file } = req;
    data.photo_url = `http://${req.hostname}:4000${file.destination
      .replace(`.`, "")
      .replace("/public", "")}${file.filename}`;
  }

  const driver = new Driver({ ...data, created_at: Date.now() });

  try {
    await driver.save();
    res.status(200).json({ success: "Driver added successfully!" });
  } catch (error) {
    res.status(400).json(`${error.name}: ${error.message}`);
  }
});

router.put("/", async (req, res) => {
  const driver = await Driver.findOne({ id: req.body._id });
  if (!driver) return res.status(404).send({ error: "Driver not found" });

  const data = _.pick(req.body, ["name", "age", "contact_number", "email"]);

  driver.set({ ...data });

  await driver.save();
  res.status(200).json(driver.name + " updated successfully");
});

router.delete("/:id", async (req, res) => {
  const driver = await Driver.findOneAndDelete({ _id: req.params.id });
  if (!driver) return res.status(404).send("Driver not found");
  if (driver.photo_url) {
    const l = driver.photo_url.split("/").length;
    fs.rmSync(`./public/drivers/${driver.photo_url.split("/")[l - 1]}`);
  }
  res.status(200).send(driver);
});

export default router;
