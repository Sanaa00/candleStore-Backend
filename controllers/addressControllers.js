import Product from "../models/products.models.js";
import Cart from "../models/cart.models.js";

import Address from "../models/address.models.js";
import { tryCatch } from "../utils/tryCatch.js";

export const getAddress = tryCatch(async (req, res) => {
  const address = await Address.find();
  // await Cart.findByIdAndUpdate(req.body.cart, {
  //   $push: { products: Cart._id },
  // });
  res.json({ status: "success", data: address });
});
export const AddAddress = tryCatch(async (req, res) => {
  const address = await Address.create(req.body);
  await Cart.findByIdAndUpdate(req.body._id, {
    $push: { address: req.body._id },
  });
  res.json({ status: "success", data: address });
});
