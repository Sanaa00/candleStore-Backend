import Product from "../models/products.models.js";
import Cart from "../models/cart.models.js";

import Address from "../models/address.models.js";
import { tryCatch } from "../utils/tryCatch.js";

export const getAddress = tryCatch(async (req, res) => {
  const address = await Address.find();
  res.json({ status: "success", data: address });
});
export const AddAddrss = tryCatch(async (req, res) => {
  const category = await Address.create(req.body);
  await Cart.findByIdAndUpdate(req.body.cart, {
    $push: { cart: req.body.cart },
  });
  res.json({ status: "success", data: category });
});
