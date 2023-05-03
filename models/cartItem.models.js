import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Types.ObjectId, ref: "product" },
  // cart: { type: mongoose.Types.ObjectId, ref: "cart" },
});
const cartItem = mongoose.model("cartItem", cartItemSchema);
export default cartItem;
