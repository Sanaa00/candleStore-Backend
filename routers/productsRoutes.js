import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  updateQuantity,
  deleteProduct,
  addProduct,
  // addProducttoCart,
  // addProductToCart,
  // productInCart,
} from "../controllers/productsControllers.js";
import { uploadMulti } from "../middleware/multer.middleware.js";
const router = Router();

router.route("/").get(getAllProducts).post(addProduct);
// router.route("/ProductToCart").post(addProducttoCart);
router.route("/upload-multi").post(uploadMulti, (req, res) => {
  res.send("success");
});
router
  .route("/:id")
  .get(getProductById)
  .patch(updateQuantity)
  .delete(deleteProduct);

export default router;
