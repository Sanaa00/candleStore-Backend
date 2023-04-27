import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address: { type: String, required: true },

  cart: [{ type: mongoose.Types.ObjectId, ref: "cart", required: true }],
});
const address = mongoose.model("address", addressSchema);
export default address;
