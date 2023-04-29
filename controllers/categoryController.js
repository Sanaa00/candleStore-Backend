import Product from "../models/products.models.js";
import Category from "../models/category.models.js";
import { tryCatch } from "../utils/tryCatch.js";

//
export const getCategory = tryCatch(async (req, res) => {
  const category = await Category.find().populate("products");

  res.json({ status: "success", results: category.length, data: category });
});

export const createCategory = tryCatch(async (req, res) => {
  const category = await Category.create(req.body);
  await Product.findByIdAndUpdate(req.body.Products, {
    $push: { Products: req.body.Products },
  });
  res.json({ status: "success", data: category });
});
