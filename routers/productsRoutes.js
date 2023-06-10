import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  favourite,
  deleteProduct,
  addProduct,
  getProductsforAdmin,
  discount,
} from "../controllers/productsControllers.js";
import {
  resizeImage,
  resizeImages,
  uploadMulti,
  uploadSingle,
} from "../middleware/multer.middleware.js";
import { checkRole, protect } from "../middleware/auth.middleware.js";
const router = Router();

router
  .route("/")
  .get(getAllProducts)
  .post(protect, checkRole("admin"), addProduct);
router.route("/productsForAdmin").get(getProductsforAdmin);
router.route("/upload").post(uploadSingle, resizeImage, (req, res) => {
  res.json({ path: `products/${req.file.filename}` });
});

router.route("/upload-multi").post(uploadMulti, resizeImages, (req, res) => {
  res.json({ paths: req.body.files });
});
router.route("/:id").get();

router.route("/:id").get(getProductById).put(favourite).delete(deleteProduct);
router.route("/:id/descount").put(discount);
export default router;
