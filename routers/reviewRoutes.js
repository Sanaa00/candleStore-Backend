import { Router } from "express";
import { addReview, getReview } from "../controllers/reviewControllers.js";
const router = Router();

router.route("/").post(addReview).get(getReview);

export default router;
