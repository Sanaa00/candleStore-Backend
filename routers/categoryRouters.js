import { Router } from "express";
import {
  createCategory,
  getCategory,
} from "../controllers/categoryController.js";

const router = Router();
router.route("/").get(getCategory).post(createCategory);
// router.route("/:id").patch(updateCartQuantity).delete(deleteCartItem);

export default router;
