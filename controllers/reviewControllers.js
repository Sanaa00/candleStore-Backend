import path from "path";
import fs from "fs";
import Review from "../models/review.models.js";
import Product from "../models/products.models.js";
import { tryCatch } from "../utils/tryCatch.js";
const __dirname = path.resolve();
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/db.json`));

export const addReview = tryCatch(async (req, res) => {
  const review = await Review.create(req.body);
  await Product.findByIdAndUpdate(req.body.product, {
    $push: { review: review._id },
  });

  res.status(200).json({ status: "success", data: review });
});
export const getReview = tryCatch(async (req, res) => {
  const addReview = await Review.find();

  res.status(200).json({ status: "success", data: addReview });
});
