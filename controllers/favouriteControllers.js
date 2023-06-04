import path from "path";
import fs from "fs";
import Favourite from "../models/favourite.models.js";
import Category from "../models/category.models.js";
import mongoose from "mongoose";
// import favourite from "../models/cart.models.js";
import { tryCatch } from "../utils/tryCatch.js";

const __dirname = path.resolve();
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/db.json`));

export const getAllFavourite = tryCatch(async (req, res) => {
  try {
    const userId = req.params.userId;
    const favourite = await Favourite.find();

    res.status(200).json({ status: "success", data: favourite });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export const addToFavourite = tryCatch(async (req, res, next) => {
  const user = req.user.sub;
  const { productId, favourite } = req.body;

  if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid productId" });
  }

  const fav = await Favourite.findOne({ user });

  if (!fav) {
    const newFav = await Favourite.create({
      products: [{ productId, favourite }],
      user,
    });

    return res.status(201).json({ status: "success", data: newFav });
  } else {
    if (productId) {
      const existingProduct = fav.products.find(
        (item) => item?.productId?.toString() === productId
      );
      if (existingProduct) {
        existingProduct.favourite = favourite || true;
      } else {
        fav.products.push({ productId, favourite });
      }
    }

    // if (req.body.totalprice) {
    //   if (!cart.totalprice) {
    //     cart.totalprice.push(req.body.totalprice);
    //   } else {
    //     cart.totalprice = req.body.totalprice;
    //   }
    // }

    // if (req.body.address) {
    //   if (!cart.address) {
    //     cart.address.push(req.body.address);
    //   } else {
    //     cart.address = req.body.address;
    //   }
    // }
    // if (req.body.status) {
    //  if (!cart.address) {
    //    cart.address.push(req.body.address);
    //  } else {
    // cart.status = req.body.status;
    // }
    //  }

    await fav.save();
  }

  res.status(201).json({ status: "success", data: fav });
});

export const deleteFavItem = tryCatch(async (req, res) => {
  const favId = req.body.favId;
  const productId = req.body.productId;

  try {
    const fav = await Favourite.findOne({ _id: favId });

    if (!fav) {
      return res
        .status(404)
        .json({ status: "error", message: "fav not found" });
    }

    const productIndex = fav.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex !== -1) {
      fav.products.splice(productIndex, 1);
    }

    await fav.save();
    return res.status(200).json({ status: "success", data: fav });
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
export const getFavByUserId = tryCatch(async (req, res) => {
  try {
    const userId = req.params.userId;
    const fav = await Favourite.find({ user: userId })
      .populate("products.productId")
      .populate("user");

    res.status(200).json({ status: "success", data: fav });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});
