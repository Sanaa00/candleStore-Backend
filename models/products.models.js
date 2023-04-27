import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  productName: { type: String },
  description: { type: String },
  price: { type: Number },
  color: [String],
  images: { type: [String], required: true },
  raiting: { type: Number, default: 1 },
  // category: String,
  quantity: { type: Number, default: 1 },
  discount: Number,
  favourite: Boolean,

  // users: [{ type: mongoose.Types.ObjectId, ref: "user" }],
  cart: [{ type: mongoose.Types.ObjectId, ref: "cart" }],
  categoryId: {
    type: mongoose.Types.ObjectId,
    ref: "category",
    required: true,
  },
});
const product = mongoose.model("product", productsSchema);
export default product;
