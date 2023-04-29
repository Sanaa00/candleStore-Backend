import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  // productName: { type: String, required: true },
  // description: { type: String, required: true },
  // price: { type: Number, required: true },
  // color: [String],
  // images: { type: [String] },
  // raiting: { type: Number, default: 1 },
  // quantity: { type: Number, default: 1 },
  status: { type: String, default: "cart" },
  // address: { type: String },
  // review: String,
  // category: String,

  user: { type: mongoose.Types.ObjectId, ref: "user" },
  address: { type: mongoose.Types.ObjectId, ref: "address" },

  // order: { type: mongoose.Types.ObjectId, ref: "order" },
  products: [{ type: mongoose.Types.ObjectId, ref: "product" }],
});
const cart = mongoose.model("cart", cartSchema);
export default cart;
