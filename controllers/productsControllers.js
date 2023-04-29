import path from "path";
import fs from "fs";
import Product from "../models/products.models.js";
import Category from "../models/category.models.js";
import Cart from "../models/cart.models.js";
import { tryCatch } from "../utils/tryCatch.js";

const __dirname = path.resolve();
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/db.json`));

export const getAllProducts = tryCatch(async (req, res) => {
  let query = {};

  query = JSON.parse(
    JSON.stringify(req.query).replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    )
  );

  if (req.query.search) {
    query.productName = new RegExp(req.query.search, "i");
  }

  delete query.search;

  console.log(query);
  // abet await labary inja ish lasar hamu datakan bkay
  //excluteQuery bakar ahene bo detele krdny aw fielda zyaday drus abet ka sort akay yan search  u labrdny harchiak ka la find nia yan la db nia
  // agar - bo nawy feildaka zyad bkay la url awa sortaka 3aks akatwa
  const products = await Product.find(query)
    .populate("categoryId", "category")
    .populate("cart");
  res.json({ status: "success", data: products });
});
export const getProductById = tryCatch(async (req, res) => {
  const id = req.params.id;

  const product = await Product.findById(id)
    .populate("categoryId", "category")
    .populate("cart");

  if (!product) {
    res.status(404).json({ status: "error", message: "product not found" });
  }
  res.status(200).json({ status: "success", data: product });
});
export const updateQuantity = tryCatch(async (req, res) => {
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

  // await Cart.findByIdAndUpdate(req.body.cart, {
  //   $push: { cart: product._id },
  // });

  res.status(200).json({ status: "success", data: product });
});

export const addProductToCart = tryCatch(async (req, res) => {
  const product = await Product.find(req.body);

  await Cart.findByIdAndUpdate(req.body.cart, {
    $push: { products: product._id },
  });

  res.status(200).json({ status: "success", data: product });
});

// export const productInCart = tryCatch(async (req, res) => {
//   const product = await Product.find();

//   res.json({ status: "success", results: product.length, data: product });
// });
// http://localhost:8080/api/products?search=bubble&category=Simple
