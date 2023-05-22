import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  status: { type: String, default: "cart" },
  totalprice: [{ type: Number, default: 0 }],
  user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  address: [{ type: {}, default: "no address" }],
  // address: [{ type: mongoose.Types.ObjectId, ref: "address" }],
  products: [
    {
      productId: { type: mongoose.Types.ObjectId, ref: "product" },
      quantity: { type: Number, default: 1 },
    },
  ],
  // products: [
  //   {
  //     productId: { type: mongoose.Types.ObjectId, ref: "product" },
  //     quantity: Number,
  //   },
  // ],
});
const cart = mongoose.model("cart", cartSchema);
export default cart;
