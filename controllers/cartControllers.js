import User from "../models/user.models.js";
import Product from "../models/products.models.js";
import CustomError from "../CustomError.js";
import Address from "../models/address.models.js";
import { json } from "express";
import path from "path";
import fs from "fs";
import Cart from "../models/cart.models.js";
import mongoose from "mongoose";
import { tryCatch } from "../utils/tryCatch.js";

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
export const getOrder = tryCatch(async (req, res) => {
  const order = await Cart.find({ status: "order" })
    .populate("products")
    .populate("address")
    .populate("user");

  // await Address.findByIdAndUpdate(req.body.address, {
  //   $push: { address: address._id },
  // });

  res.json({ status: "success", data: order });
});
//   export const addToCart = tryCatch(async (req, res, next) => {
//   const user = req.user.sub;
//   const { productId, quantity, totalprice, address } = req.body;
// if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
//   return res
//     .status(400)
//     .json({ status: "error", message: "Invalid productId" });
// }
//   const cart = await Cart.findOne({ user, status: "cart" });
//   if (!cart) {
//     const newCart = await Cart.create({
//       products: [{ productId, quantity }],
//       user,
//     });
//     return res.status(201).json({ status: "success", data: newCart });
//   } else {
//     if (productId) {
//       const existingProduct = cart.products.find(
//         (item) => item.productId.toString() === productId
//       );
//       if (existingProduct) {
//         existingProduct.quantity += quantity || 1;
//       } else {
//         cart.products.push({ productId, quantity });
//       }
//     }
//     if (totalprice) {
//       if (!cart.totalprice) {
//         cart.totalprice.push(totalprice);
//       } else {
//         cart.totalprice = totalprice;
//       }
//     }
//     await cart.save();
//     if (address) {
//       if (!cart.address || cart.address !== address) {
//         await cart.save(); // Save the cart with products and total before resetting
//         // Reset the cart to empty
//         cart.products = [];
//         cart.totalprice = null;
//         cart.address = address;
//         await cart.save(); // Save the cart with the updated address
//       }
//     } else {
//       await cart.save(); // Save the cart without resetting
//     }
//     res.status(201).json({ status: "success", data: cart });
//   }
// });

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
    if (req.body.status) {
      //  if (!cart.address) {
      //    cart.address.push(req.body.address);
      //  } else {
      cart.status = req.body.status;
    }
    //  }

    await cart.save();
  }

  res.status(201).json({ status: "success", data: cart });
});

export const updateCartQuantity = tryCatch(async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      res.status(400).json({ error: "Invalid cartId" });
      return;
    }

    const cart = await Cart.findOne({ _id: cartId, status: "cart" }); // Find the cart with the specified ID and status 'cart'

    if (!cart) {
      return res
        .status(404)
        .json({ error: "Cart not found or not in the cart state" });
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

// export const updateCartQuantity = tryCatch(async (req, res) => {
//   try {
//     const { cartId, productId } = req.params;
//     const { quantity } = req.body;
//     if (!mongoose.Types.ObjectId.isValid(cartId)) {
//       res.status(400).json({ error: "Invalid cartId" });
//       return;
//     }
//     const cart = await Cart.findOne(cartId);

//     if (!cart || cart.status !== "cart") {
//       return res.status(404).json({ error: "Cart not found" });
//     }
//     const product = cart.products.find(
//       (p) => p.productId.toString() === productId
//     );

//     if (!product) {
//       return res.status(404).json({ error: "Product not found in the cart" });
//     }

//     product.quantity = quantity;
//     await cart.save();

//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

export const getCartByUserId = tryCatch(async (req, res) => {
  try {
    const userId = req.params.userId;
    const carts = await Cart.find({ user: userId, status: "cart" })
      .populate("products.productId")
      .populate("user");
    console.log(carts); // log the carts to see if the updated cart is included
    res.status(200).json({ status: "success", data: carts });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export const deleteCartItem = tryCatch(async (req, res) => {
  const cartId = req.body.cartId;
  const productId = req.body.productId;

  try {
    const cart = await Cart.findOne({ _id: cartId, status: "cart" });

    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
    }

    await cart.save();
    return res.status(200).json({ status: "success", data: cart });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "An error occurred" });
  }
  // const cartId = req.body.cartId;
  // const productId = req.body.productId;
  // const cart = await Cart.findById(
  //   // cartId
  //   { cartId, status: "cart" }
  // );
  // console.log("here5");
  // if (!cart) {
  //   console.log("here4");
  //   return res.status(404).json({ status: "error", message: "Cart not found" });
  // }
  // console.log("here3");
  // const productIndex = cart.products.findIndex(
  //   (item) => item.productId.toString() === productId
  // );
  // console.log("here");
  // if (productIndex !== -1) {
  //   cart.products.splice(productIndex, 1);
  // }
  // try {
  //   await cart.save();
  //   return res.status(200).json({ status: "success", data: cart });
  // } catch (error) {
  //   console.log("here2");
  //   return res
  //     .status(500)
  //     .json({ status: "error", message: "An error occurred" });
  // }
});
