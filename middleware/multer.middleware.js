import multer from "multer";
import CustomError from "../CustomError.js";
import sharp from "sharp";

const multerStorage = multer.memoryStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new CustomError("not an image", 400, 5000));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: fileFilter,
});
export const uploadMulti = upload.array("photo", 5);

export const uploadSingle = upload.single("photo");

export const resizeImage = async (req, res, next) => {
  req.file.filename = `student-${Date.now()}-${Math.round(
    Math.random() * 1000
  )}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/students/${req.file.filename}`);

  next();
};

export const resizeImages = async (req, res, next) => {
  req.body.files = [];
};
