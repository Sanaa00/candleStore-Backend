import { Router } from "express";
import {
  getUser,
  login,
  signup,
  getCurrentUser,
} from "../controllers/userControllers.js";
import { signUpMiddleware, protect } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/").get(getUser);

router.route("/signup").post(signUpMiddleware, signup);

router.post("/login", login);
router.route("/currentuser").get(protect, getCurrentUser);

export default router;
