import path from "path";
import fs from "fs";
import Cart from "../models/cart.models.js";
import User from "../models/user.models.js";
import Product from "../models/products.models.js";
import CustomError from "../CustomError.js";
import mongoose from "mongoose";

import { tryCatch } from "../utils/tryCatch.js";
import { json } from "express";
const __dirname = path.resolve();
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/db.json`));

export const getCartProduct = tryCatch(async (req, res) => {
  const cartItem = await Cart.find().populate("products").populate("address");
  res.json({ status: "success", data: cartItem });
});

export const addToCart = tryCatch(async (req, res, next) => {
  const user = req.user.sub;
  console.log(req.user);
  const cart = await Cart.findOne({ user, status: "cart" }); //bo away tanya awanay cart bigarenetawa nak orderakan
  if (!cart) {
    const newCart = await Cart.create({
      products: [req.body.productId],
      user,
      // totalrice: req.body.total,
      address: [req.body.address],
    });

    res.status(201).json({ status: "success", data: newCart });
  } else {
    cart.products.push(req.body.productId);
    // cart.totalprice.set(req.body.total);
    cart.address.push(req.body.address);

    // if (req.body.totalPrice) {
    //   cart.totalPrice.push(req.body.totalPrice);
    // }
    // cart.address.push(req.body.address);
    // cart.totalPrice.push(req.body.totalPrice);

    await cart.save();
    res.status(201).json({ status: "success", data: cart });
  }

  // await Product.findByIdAndUpdate(req.body.products, {
  //   $push: { products: req.body.products },
  // });
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
export const getCartById = tryCatch(async (req, res) => {
  const id = req.params.id;
  const itemId = req.body.id;
  const cart = await Cart.findById(id);
  // const product = await Cart.find();

  if (!cart) {
    res.status(404).json({ status: "error", message: "cart not found" });
  }

  res.status(200).json({ status: "success", data: cart });
});

export const deleteCartItem = tryCatch(async (req, res) => {
  // const cart = await Cart.products.findIndex((p) => p._d == id);
  // if (cart) {
  //   Cart.products.splice(cart, 1);
  // }
  const id = req.params.id;

  const cart = await Cart.findByIdAndDelete(id, { new: true });
  res.status(200).json({ status: "success", data: cart });
  if (!cart) {
    return new CustomError("product not found", 401, 4001);
  }
});
