import path from "path";
import fs from "fs";
import Cart from "../models/cart.models.js";
import Product from "../models/products.models.js";
import CustomError from "../CustomError.js";
import { tryCatch } from "../utils/tryCatch.js";
const __dirname = path.resolve();
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/db.json`));

export const getCartProduct = tryCatch(async (req, res) => {
  const cartItem = await Cart.find();
  res.json({ status: "success", data: cartItem });
});

export const addToCart = tryCatch(async (req, res, next) => {
  const cart = await Cart.create(req.body);

  await Product.findByIdAndUpdate(req.body.products, {
    $set: { product_id: cart._id },
  });
  res.status(201).json({ status: "success", data: cart });
});

export const updateCartQuantity = tryCatch(async (req, res) => {
  const id = req.params.id;
  const cart = await Cart.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({ status: "seccuss", data: cart });
  if (!cart) {
    return new CustomError("product not found", 401, 4001);
    // res.status(404).json({ status: "error", message: "product not found" });
  }
});

export const deleteCartItem = tryCatch(async (req, res) => {
  const id = req.params.id;
  const cart = await Cart.findByIdAndDelete(id, { new: true });
  res.status(200).json({ status: "success", data: cart });
  if (!cart) {
    return new CustomError("product not found", 401, 4001);
    // res.status(404).json({ status: "error", message: "product not found" });
  }
});
