import mongoose from "mongoose";

const RequestSchema =  new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now }
});

const requestmodel=  mongoose.model("Request", RequestSchema);
export default requestmodel;