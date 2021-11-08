import mongoose from "mongoose";
import Joi from "joi";

const vehicleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, max: 100 },
    capacity: { type: Number, required: true, min: 5, max: 15 },
    baseprice: { type: Number, required: true, min: 0 },
    price0to5: { type: Number, required: true, min: 0 },
    price5to10: { type: Number, required: true, min: 0 },
    price10to15: { type: Number, required: true, min: 0 },
    price15plus: { type: Number, required: true, min: 0 },
    photos: { type: [Object], default: [] },
  },
  { strict: false }
);

// export const validate = (user) => {
//   const schema = Joi.object({
//     name: Joi.string().required(),
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(6).max(100),
//   });

//   return schema.validate(user);
// };

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
