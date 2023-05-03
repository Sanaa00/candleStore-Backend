import path from "path";
import fs from "fs";
import CartItem from "../models/cartItem.models.js";
import Product from "../models/products.models.js";
import CustomError from "../CustomError.js";

import { tryCatch } from "../utils/tryCatch.js";
const __dirname = path.resolve();
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/db.json`));

export const getCartItem = tryCatch(async (req, res) => {
  const cartItem = await CartItem.find().populate("productId");
  res.json({ status: "success", data: cartItem });
});

export const addToCartItem = tryCatch(async (req, res, next) => {
  const cart = await CartItem.create(req.body);
  // await Product.findByIdAndUpdate(req.body.productId, {
  //   $push: { productId: req.body.productId },
  // });

  res.status(201).json({ status: "success", data: cart });
});
