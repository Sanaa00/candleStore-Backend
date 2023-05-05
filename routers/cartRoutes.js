import { Router } from "express";
import {
  addToCart,
  getCartProduct,
  updateCartQuantity,
  deleteCartItem,
  getCartByUserId,
} from "../controllers/cartControllers.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router
  .route("/")
  .get(getCartProduct)
  .post(protect, addToCart)
  // .put(updateCartQuantity)
  .delete(deleteCartItem);

router.route("/:cartId").put(updateCartQuantity);
router.route("/:userId").get(getCartByUserId);

export default router;
