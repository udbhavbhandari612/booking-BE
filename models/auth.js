import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, max: 100 },
  },
  { strict: false }
);

const Auth = mongoose.model("Auth", authSchema);

export default Auth;
