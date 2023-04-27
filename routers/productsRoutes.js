import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  updateQuantity,
  deleteProduct,
  addProduct,
} from "../controllers/productsControllers.js";
const router = Router();

router.route("/").get(getAllProducts).post(addProduct);
router
  .route("/:id")
  .get(getProductById)
  .patch(updateQuantity)
  .delete(deleteProduct);

export default router;
