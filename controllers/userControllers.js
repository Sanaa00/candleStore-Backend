import path from "path";
import fs from "fs";
import Users from "../models/user.models.js";
import Cart from "../models/cart.models.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { tryCatch } from "../utils/tryCatch.js";
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
  }
};
export const login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new CustomError("product not found", 401, 4001);
        next(error);
        return;
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return new CustomError(error.message, 401, 4001);
        const body = { sub: user._id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

        res.json({ token, user });
      });
    } catch (err) {}
  })(req, res, next);
};
