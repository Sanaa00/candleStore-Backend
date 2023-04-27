import { Router } from "express";
// import { getUser, signup } from "../controllers/userControllers.js";
// import { signup } from "../controllers/userControllers.js";
// import passport from "passport";
// import { loginMiddlware } from "../middleware/auth.middleware.js";
import {
  getUser,
  login,
  signup,
  getCurrentUser,
} from "../controllers/userControllers.js";
import { signUpMiddleware, protect } from "../middleware/auth.middleware.js";
// import { protect, signUpMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/").get(getUser);
// .post(addUser);
// router.route("/signup");
router.route("/signup").post(signUpMiddleware, signup);

router.post("/login", login);
router.route("/currentuser").get(protect, getCurrentUser);
//   .post(passport.authenticate("signup", { session: false }), signup);

// router.post("/login", loginMiddlware);
export default router;
