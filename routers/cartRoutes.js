import { Router } from "express";

import {
  addToCart,
  getCartProduct,
  updateCartQuantity,
  deleteCartItem,
  getCartByUserId,
  getOrder,
} from "../controllers/cartControllers.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router
  .route("/")
  .delete(deleteCartItem)
  .get(protect, getCartProduct)
  .post(protect, addToCart);
router.route("/order").get(getOrder);

router.route("/:cartId/products/:productId").put(updateCartQuantity);
router.route("/:userId").get(getCartByUserId);

export default router;
