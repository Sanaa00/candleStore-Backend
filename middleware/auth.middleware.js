import passport from "passport";
import UserModel from "../models/user.models.js";
import CustomError from "../CustomError.js";

export const signUpMiddleware = passport.authenticate("signup", {
  session: false,
});

export const protect = passport.authenticate("jwt", { session: false });

export const checkRole = (role) => {
  return async (req, res, next) => {
    try {
      console.log(req.user.sub, "sub");
      const user = await UserModel.findById(req.user.sub);

      if (!user || user.role !== role) {
        throw new CustomError("not authorized", 401, 4000);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
