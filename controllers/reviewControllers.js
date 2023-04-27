import path from "path";
import fs from "fs";
import Review from "../models/review.models.js";
import { tryCatch } from "../utils/tryCatch.js";
const __dirname = path.resolve();
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/db.json`));

export const addReview = tryCatch(async (req, res) => {
  const addReview = await Review.create(req.body);
  res.status(200).json({ status: "success", data: addReview });
});
export const getReview = tryCatch(async (req, res) => {
  const addReview = await Review.find();
  res.status(200).json({ status: "success", data: addReview });
});
