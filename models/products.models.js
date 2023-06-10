import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  productName: { type: String },
  description: { type: String },
  price: { type: Number },
  color: [String],
  images: {
    type: [String],
  },
  raiting: { type: Number, default: 1 },
  discount: Number,
  favourite: Boolean,

  categoryId: {
    type: mongoose.Types.ObjectId,
    ref: "category",
    required: true,
  },
  review: [
    {
      type: mongoose.Types.ObjectId,
      ref: "review",
    },
  ],
});
const product = mongoose.model("product", productsSchema);
export default product;
