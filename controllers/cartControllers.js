import path from "path";
import fs from "fs";
import Cart from "../models/cart.models.js";
import User from "../models/user.models.js";
import Product from "../models/products.models.js";
import CustomError from "../CustomError.js";
import Address from "../models/address.models.js";
import mongoose from "mongoose";
// import mongoose from "mongoose";
// const mongoose = require("mongoose");

import { tryCatch } from "../utils/tryCatch.js";
import { json } from "express";
import address from "../models/address.models.js";
const __dirname = path.resolve();
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/db.json`));

export const getCartProduct = tryCatch(async (req, res) => {
  const cartItem = await Cart.find()
    .populate("products")
    .populate("address")
    .populate("user");
  // await Address.findByIdAndUpdate(req.body.address, {
  //   $push: { address: address._id },
  // });
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
      // address: [req.body.address],
    });

    res.status(201).json({ status: "success", data: newCart });
  } else {
    if (req.body.totalprice) {
      if (!cart.totalprice) {
        cart.totalprice.push(req.body.totalprice);
      } else {
        cart.totalprice = req.body.totalprice;
      }
    }
    //todo: check bkaytawa agar itemka haya qantity zyda bkat
    cart.products.push(req.body.productId);

    if (req.body.address) {
      if (!cart.address) {
        cart.address.push(req.body.address);
      } else {
        cart.address = req.body.address;
      }
    }
    await cart.save();
    res.status(201).json({ status: "success", data: cart });
  }
});
//TODO: updtae qantity xalata
export const updateCartQuantity = tryCatch(async (req, res) => {
  const cartId = req.params.cartId;
  const productId = req.body.productId;
  const newQuantity = req.body.quantity;

  const cart = await Cart.findByIdAndUpdate(cartId).populate("products");

  const product = cart.products.find(
    (product) => product._id.toString() === productId
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found in cart" });
  }

  product.quantity = newQuantity;

  await cart.save();

  res.status(200).json({ status: "success", data: cart });
});

export const getCartByUserId = tryCatch(async (req, res) => {
  try {
    const userId = req.params.userId;
    const carts = await Cart.find({ user: userId })
      .populate("products")
      .populate("user");
    console.log(carts); // log the carts to see if the updated cart is included
    res.status(200).json({ status: "success", data: carts });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export const deleteCartItem = tryCatch(async (req, res) => {
  const userId = req.body.userId;
  // const userId = "6453798d587d2dd51e7affac";
  const productIdToRemove = req.body._id;

  const cartitems = await Cart.findOne({ user: userId }).then((cart) => {
    if (!cart) {
      return new CustomError("cart not found", 401, 4001);
    }

    const productIndex = cart.products.findIndex(
      (product) => String(product?._id) === productIdToRemove
    );
    console.log(productIdToRemove);

    if (productIndex === -1) {
      throw new Error("Product not found in cart");
    }

    cart.products.splice(productIndex, 1);
    // res.status(200).json({ status: "success", data: cart });

    res.status(200).json({ status: "success", data: cart });
    if (!cart) {
      return new CustomError("product not found", 401, 4001);
    }
    return cart.save();
  });
});
