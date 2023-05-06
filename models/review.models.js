import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  message: { type: String, required: true, length: 50 },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "product",
    required: true,
  },
});
const review = mongoose.model("review", reviewSchema);
export default review;
