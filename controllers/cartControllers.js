import path from "path";
import fs from "fs";
import Cart from "../models/cart.models.js";
import User from "../models/user.models.js";
import Product from "../models/products.models.js";
import CustomError from "../CustomError.js";
import Address from "../models/address.models.js";
import mongoose from "mongoose";
import { tryCatch } from "../utils/tryCatch.js";
import { json } from "express";

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
  const { productId, quantity } = req.body;

  if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid productId" });
  }

  const cart = await Cart.findOne({ user, status: "cart" });

  if (!cart) {
    const newCart = await Cart.create({
      products: [{ productId, quantity }],
      user,
    });

    return res.status(201).json({ status: "success", data: newCart });
  } else {
    if (productId) {
      const existingProduct = cart.products.find(
        (item) => item.productId.toString() === productId
      );
      if (existingProduct) {
        existingProduct.quantity += quantity || 1;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    if (req.body.totalprice) {
      if (!cart.totalprice) {
        cart.totalprice.push(req.body.totalprice);
      } else {
        cart.totalprice = req.body.totalprice;
      }
    }

    if (req.body.address) {
      if (!cart.address) {
        cart.address.push(req.body.address);
      } else {
        cart.address = req.body.address;
      }
    }

    await cart.save();
  }

  res.status(201).json({ status: "success", data: cart });
});

export const updateCartQuantity = tryCatch(async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const product = cart.products.find(
      (p) => p.productId.toString() === productId
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found in the cart" });
    }

    product.quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const getCartByUserId = tryCatch(async (req, res) => {
  try {
    const userId = req.params.userId;
    const carts = await Cart.find({ user: userId })
      .populate("products.productId")
      .populate("user");
    console.log(carts); // log the carts to see if the updated cart is included
    res.status(200).json({ status: "success", data: carts });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export const deleteCartItem = tryCatch(async (req, res) => {
  const cartId = req.body.cartId; // Replace with the actual cart ID
  const productId = req.body.productId; // Replace with the actual product ID

  try {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }

    // Find the index of the product in the products array
    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex !== -1) {
      // Remove the product from the products array
      cart.products.splice(productIndex, 1);
    }

    await cart.save();
    return res.status(200).json({ status: "success", data: cart });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "An error occurred" });
  }
});
