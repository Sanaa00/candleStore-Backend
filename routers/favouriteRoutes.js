import { Router } from "express";
import {
  getAllFavourite,
  //   getProductById,
  //   favourite,
  deleteFavItem,
  addToFavourite,
  getFavByUserId,
} from "../controllers/favouriteControllers.js";
import { uploadMulti } from "../middleware/multer.middleware.js";
import { checkRole, protect } from "../middleware/auth.middleware.js";
const router = Router();

router
  .route("/")
  .get(getAllFavourite)
  .post(protect, addToFavourite)
  .delete(deleteFavItem);

// router.route("/upload-multi").post(uploadMulti, (req, res) => {
//   res.send("success");
// });
router.route("/:userId").get(getFavByUserId);

export default router;
