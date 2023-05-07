import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  products: [{ type: mongoose.Types.ObjectId, ref: "product" }],
});
const category = mongoose.model("category", categorySchema);
export default category;
