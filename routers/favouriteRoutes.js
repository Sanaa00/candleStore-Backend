import { Router } from "express";
import {
  getAllFavourite,
  deleteFavItem,
  addToFavourite,
  getFavByUserId,
} from "../controllers/favouriteControllers.js";
import { protect } from "../middleware/auth.middleware.js";
const router = Router();

router
  .route("/")
  .get(getAllFavourite)
  .post(protect, addToFavourite)
  .delete(deleteFavItem);

router.route("/:userId").get(getFavByUserId);

export default router;
