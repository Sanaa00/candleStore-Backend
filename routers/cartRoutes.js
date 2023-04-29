import { Router } from "express";
import {
  addToCart,
  getCartProduct,
  updateCartQuantity,
  deleteCartItem,
} from "../controllers/cartControllers.js";

const router = Router();
router.route("/").get(getCartProduct).post(addToCart);

router.route("/:id").patch(updateCartQuantity).delete(deleteCartItem);

export default router;
