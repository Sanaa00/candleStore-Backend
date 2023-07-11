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

   let query = JSON.stringify(req.query);
  query = query.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

  let queryObj = JSON.parse(query);
  //  queryObj.status = "order"||"Completed"||"Pending"; 
queryObj.status = { $in: ["order", "Completed", "Pending"] };
  const excluteQuery = ["limit", "page", "search"];

  excluteQuery.forEach((key) => {
    delete queryObj[key];
  });

  const getQuery = Cart.find( queryObj).populate("user");
  const page = req.query.page || 1;
  const limit = req.query.limit || 6;
  const skip = limit * (page - 1);
  const OrderLength = (await Cart.find(queryObj)).length;

  getQuery.skip(skip).limit(limit);
  const Orders = await getQuery;

  res.json({ status: "success", data: { result: OrderLength, Orders } });

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

export const getCartByUserId = tryCatch(async (req, res) => {
  try {
    const userId = req.params.userId;
    const carts = await Cart.find({ user: userId, status: "cart" })
      .populate("products.productId").populate("user");
    // console.log(carts); // log the carts to see if the updated cart is included
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
export const getcartById = tryCatch(async (req, res) => {
  const id = req.params._id;

  const cart = await Cart.findById(id).populate("user")
    // .populate("user")


  if (!cart) {
    res.status(404).json({ status: "error", message: "cart not found" });
  }
  res.status(200).json({ status: "success", data: cart });
});
export const updateOrderStatus = tryCatch(async (req, res) => {
  const orderId = req.params.id;
  const newStatus = req.body.status;

  Cart.findByIdAndUpdate(
    orderId,
    { $set: { status: newStatus } },
    { new: true }
  )
    .then((order) => {
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ status: 'success', order });
    })
})
   
   
//  const orderIds = req.body.orderIds; // Array of order IDs
//   const newStatus = req.body.status; // New status value

//   try {
//     const updatedOrders = await Cart.updateMany(
//       { _id: { $in: orderIds } },
//       { $set: { status: newStatus } }
//     );

//     res.json({
//       status: "success",
//       message: "Orders updated successfully",
//       updatedOrders: updatedOrders.nModified,
//     });
//   } catch (error) {
//     res.status(500).json({ status: "error", message: "Failed to update orders" });
//   }
// }

  // const  orderId  = req.params._id;
  // const  status  = req.body.status;

  // const updatedOrder = await Cart.findByIdAndUpdate(
  //  orderId,
  //   { status },
  //   { new: true }

  // )

  // if (!updatedOrder) {
  //   return res.status(404).json({ status: "error", message: "Order not found" });
  // }

  

  // res.json({ status: "success", data: { Orders: updatedOrder } });
// );