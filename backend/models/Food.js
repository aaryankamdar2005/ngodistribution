import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  foodType: { type: String, required: true },
  quantity: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ["available", "claimed", "expired"], default: "available" },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

const foodmodel = mongoose.model("Food", FoodSchema);
export default foodmodel;