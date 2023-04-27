import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  //   cart: [{ type: String, required: true }],

  price: { type: Number, required: true },
  address: { type: String, required: true },
  state: { type: String },

  user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  cart: [{ type: mongoose.Types.ObjectId, ref: "cart" }],
});
const order = mongoose.model("order", orderSchema);
export default order;
