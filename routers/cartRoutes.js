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
  .delete(deleteCartItem)
  .get(getCartProduct)
  .post(protect, addToCart);

router.route("/:cartId/products/:productId").put(updateCartQuantity);
router.route("/:userId").get(getCartByUserId);

export default router;
