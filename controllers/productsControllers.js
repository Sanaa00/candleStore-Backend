import path from "path";
import fs from "fs";
import Product from "../models/products.models.js";
import Category from "../models/category.models.js";
import { tryCatch } from "../utils/tryCatch.js";
const __dirname = path.resolve();
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/db.json`));

export const getAllProducts = tryCatch(async (req, res) => {
  let query = JSON.stringify(req.query);
  query = query.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

  let queryObj = JSON.parse(query);

  const excluteQuery = ["limit", "page", "search"];

  excluteQuery.forEach((key) => {
    delete queryObj[key];
  });

  if (req.query.search) {
    queryObj.productName = new RegExp(req.query.search, "i");
  }
  const getQuery = Product.find(queryObj).populate("categoryId", "category");
  const page = req.query.page || 1;
  const limit = req.query.limit || 6;
  const skip = limit * (page - 1);
  const productLength = (await Product.find(queryObj)).length;

  getQuery.skip(skip).limit(limit);
  const products = await getQuery;

  res.json({ status: "success", data: { result: productLength, products } });

  res.json({ status: "success", data: products });
});
export const getProductById = tryCatch(async (req, res) => {
  const id = req.params.id;

  const product = await Product.findById(id)
    .populate("categoryId", "category")
    .populate("review");

  if (!product) {
    res.status(404).json({ status: "error", message: "product not found" });
  }
  res.status(200).json({ status: "success", data: product });
});
export const favourite = tryCatch(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
  if (!product) {
    return new CustomError("product not found", 401, 4001);
  }
  res.status(200).json({ status: "success", data: product });
});
export const deleteProduct = tryCatch(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndDelete(id, { new: true });

  if (!product) {
    return new CustomError("product not found", 401, 4001);
  }

  res.status(200).json({ status: "success", data: product });
});
export const addProduct = tryCatch(async (req, res) => {
  const product = await Product.create(req.body);

  await Category.findByIdAndUpdate(req.body.categoryId, {
    $push: { products: product._id },
  });

  res.status(200).json({ status: "success", data: product });
});
export const getProductsforAdmin = tryCatch(async (req, res) => {
  const order = await Product.find().populate("review");

  res.json({ status: "success", data: order });
});
export const discount = tryCatch(async (req, res) => {
  try {
    const productId = req.params.id;
    const newDiscount = req.body.discount;

    const product = await Product.findByIdAndUpdate(
      productId,
      { discount: newDiscount },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
