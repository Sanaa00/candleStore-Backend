import { Router } from "express";
import {
  addToCart,
  getCartProduct,
  updateCartQuantity,
  deleteCartItem,
  getCartById,
} from "../controllers/cartControllers.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/").get(getCartProduct).post(protect, addToCart);

router
  .route("/:id")
  .patch(updateCartQuantity)
  .delete(deleteCartItem)
  .get(getCartById);

export default router;
