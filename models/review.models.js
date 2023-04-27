import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  message: { type: String, required: true, length: 50 },
});
const review = mongoose.model("review", reviewSchema);
export default review;
