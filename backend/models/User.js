import mongoose, { mongo } from "mongoose";

const Userschema = new mongoose.Schema({
    name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["donor", "receiver"], required: true },
  phone: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

const usermodel = mongoose.model("user",Userschema);
export default usermodel;