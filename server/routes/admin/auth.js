import express from "express";
import Auth from "../../models/auth.js";
import _ from 'lodash';

const router = express.Router();

router.post("/", async (req, res) => {
  let credentials = _.pick(req.body, ["username", "password"]);
  const auth = (await Auth.find())[0];
  if (auth) {
    if (
      credentials.username === auth.username &&
      credentials.password === auth.password
    ) {
      res.status(200).json({
        token: Date.now(),
      });
      return;
    }
  }
  res.status(400).json("Invalid username or password");
});

export default router;
