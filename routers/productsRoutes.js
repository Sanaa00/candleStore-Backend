import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  updateQuantity,
  deleteProduct,
  addProduct,
} from "../controllers/productsControllers.js";
import { uploadMulti } from "../middleware/multer.middleware.js";
import { checkRole, protect } from "../middleware/auth.middleware.js";
const router = Router();

router
  .route("/")
  .get(getAllProducts)
  .post(protect, checkRole("admin"), addProduct);

router.route("/upload-multi").post(uploadMulti, (req, res) => {
  res.send("success");
});
router
  .route("/:id")
  .get(getProductById)
  .patch(updateQuantity)
  .delete(deleteProduct);

export default router;
