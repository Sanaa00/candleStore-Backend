import path from "path";
import fs from "fs";
import Product from "../models/products.models.js";
import Category from "../models/category.models.js";
import Cart from "../models/cart.models.js";
import { tryCatch } from "../utils/tryCatch.js";
import Review from "../models/review.models.js";
import review from "../models/review.models.js";

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
  // delete query.search;

  if (req.query.search) {
    queryObj.productName = new RegExp(req.query.search, "i");
  }
  const getQuery = Product.find(queryObj).populate("categoryId", "category");
  const page = req.query.page || 1;
  const limit = req.query.limit || 8;
  const skip = limit * (page - 1);
  const productLength = (await Product.find(queryObj)).length;

  getQuery.skip(skip).limit(limit);
  const products = await getQuery;
  // console.log(getQuery);

  // const totalPage = Math.ceil(products.length / limit);
  // console.log(products?.length);
  // console.log(query);
  // abet await labary inja ish lasar hamu datakan bkay
  //excluteQuery bakar ahene bo detele krdny aw fielda zyaday drus abet ka sort akay yan search  u labrdny harchiak ka la find nia yan la db nia
  // agar - bo nawy feildaka zyad bkay la url awa sortaka 3aks akatwa
  // products = await Product.find(queryObj).populate("categoryId", "category");
  // .populate("review");

  res.json({ status: "success", data: { result: productLength, products } });
  // let query = {};
  // query = JSON.parse(
  //   JSON.stringify(req.query).replace(
  //     /\b(gte|gt|lt|lte)\b/g,
  //     (match) => `$${match}`
  //   )
  // );
  // if (req.query.search) {
  //   query.productName = new RegExp(req.query.search, "i");
  // }
  // delete query.search;
  // console.log(query);
  // abet await labary inja ish lasar hamu datakan bkay
  //excluteQuery bakar ahene bo detele krdny aw fielda zyaday drus abet ka sort akay yan search  u labrdny harchiak ka la find nia yan la db nia
  // agar - bo nawy feildaka zyad bkay la url awa sortaka 3aks akatwa
  // const products = await Product.find(query).populate("categoryId", "category");
  // .populate("review");

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

  // await Review.findByIdAndUpdate(req.body.review, {
  //   $push: { review: req.body._id },
  // });

  res.status(200).json({ status: "success", data: product });
});
