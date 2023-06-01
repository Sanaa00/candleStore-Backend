import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  products: [
    {
      productId: { type: mongoose.Types.ObjectId, ref: "product" },
      favourite: { type: Boolean, default: true },
    },
  ],
});
const favourite = mongoose.model("favourite", favouriteSchema);
export default favourite;
