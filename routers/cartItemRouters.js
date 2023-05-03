import { Router } from "express";
import {
  addToCartItem,
  getCartItem,
} from "../controllers/cartItemControllers.js";

const router = Router();
router.route("/").get(getCartItem).post(addToCartItem);

export default router;
