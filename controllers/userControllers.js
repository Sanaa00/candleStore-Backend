import path from "path";
import fs from "fs";
import Users from "../models/user.models.js";
import Cart from "../models/cart.models.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { tryCatch } from "../utils/tryCatch.js";
// import cart from "../models/cart.models.js";
const __dirname = path.resolve();
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/db.json`));

export const getUser = tryCatch(async (req, res) => {
  const users = await Users.find().populate();
  await Cart.findByIdAndUpdate(req.body.cart, {
    $push: { products: Cart._id },
  });
  res.json({ status: "success", results: users.length, data: users });
});

export const getCurrentUser = tryCatch(async (req, res) => {
  try {
    const user = await Users.findById(req.user.sub).populate("cart");

    res.json({ status: "success", data: { user } });
  } catch (err) {
    res.status(404).json({ status: "error", data: err.message });
  }
});
export const signup = async (req, res, next) => {
  try {
    req.login(req.user, { session: false }, async (error) => {
      if (error) {
        return new CustomError(error.message, 401, 4001);
      }
      const body = { sub: req.user._id, email: req.user.email };
      const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
        expiresIn: "7 days",
      });

      res.json({
        status: "success",
        data: { user: req.user, token },
      });
    });
  } catch (err) {
    next(err);
    // res.status(500).json({ status: "error", data: err });
  }
};
export const login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new CustomError("product not found", 401, 4001);

        // const error = new Error("no user found");
        next(error);
        return;
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return new CustomError(error.message, 401, 4001);
        const body = { sub: user._id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

        res.json({ token });
      });
    } catch (err) {}
  })(req, res, next);
};
// export const addUser = async (req, res) => {
//   try {
//     const addUser = await User.create(req.body);
//     res.status(200).json({ status: "success", data: addUser });
//   } catch (err) {
//     res.status(404).json({ status: "error", data: err.message });
//   }
// };

// export const deleteAcount = async (req, res) => {
//   const id = req.params.id;
//   const deleteAcount = await CreateAccount.findByIdAndDelete(id, { new: true });
//   if (!deleteAcount) {
//     res.status(404).json({ status: "error", data: "product not found" });
//   }

//   res.status(200).json({ status: "success", data: deleteAcount });
// };
