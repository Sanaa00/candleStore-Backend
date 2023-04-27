import passport from "passport";
import UserModel from "../models/user.models.js";

export const signUpMiddleware = passport.authenticate("signup", {
  session: false,
});

export const protect = passport.authenticate("jwt", { session: false });

export const checkRole = (role) => {
  return async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.user.sub);

      if (!user || user.role !== role) {
        // return res.status(401).json("not authorized");
        throw CustomError("not authorized", 401, 4000);
      }
      next();
    } catch (err) {
      next(err);
      // res.status(400).json(error);
    }
  };
};

// export const loginMiddlware = async (req, res, next) => {
//   passport.authenticate("login", async (err, user, info) => {
//     try {
//       if (err || !user) {
//         const error = new Error("no user found");
//         next(error);
//       }

//       req.login(user, { session: false }, async (error) => {
//         if (error) return next(error);
//         const body = { sub: user._id, email: user.email };
//         const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

//         res.json({ token });
//       });
//     } catch (err) {}
//   })(req, res, next);
// };
