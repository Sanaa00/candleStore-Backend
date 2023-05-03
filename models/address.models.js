import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  city: { type: String, required: true },
  street: { type: String, required: true },
  phone: { type: String, required: true },

  cart: [{ type: mongoose.Types.ObjectId, ref: "cart", required: true }],
});
const address = mongoose.model("address", addressSchema);
export default address;
