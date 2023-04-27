import path from "path";
import fs from "fs";
import Order from "../models/order.models.js";
import Cart from "../models/cart.models.js";
import { tryCatch } from "../utils/tryCatch.js";
const __dirname = path.resolve();
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/db.json`));

export const getOrder = tryCatch(async (req, res) => {
  const order = await Order.find();
  res.json({ status: "success", data: order });
});

export const addToOrder = tryCatch(async (req, res) => {
  const order = await Order.create(req.body);
  await Cart.findByIdAndUpdate(req.body.cart, {
    $set: { cart: Cart._id },
  });
  res.status(201).json({ status: "success", data: order });
});
