import path from "path";
import fs from "fs";
import Product from "../models/products.models.js";
import Category from "../models/category.models.js";
import Cart from "../models/cart.models.js";
import { tryCatch } from "../utils/tryCatch.js";

const __dirname = path.resolve();
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/db.json`));

export const getAllProducts = tryCatch(async (req, res) => {
  let query = {};

  query = JSON.parse(
    JSON.stringify(req.query).replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    )
  );

  if (req.query.search) {
    query.productName = new RegExp(req.query.search, "i");
  }

  delete query.search;

  console.log(query);
  // abet await labary inja ish lasar hamu datakan bkay
  //excluteQuery bakar ahene bo detele krdny aw fielda zyaday drus abet ka sort akay yan search  u labrdny harchiak ka la find nia yan la db nia
  // agar - bo nawy feildaka zyad bkay la url awa sortaka 3aks akatwa
  const products = await Product.find(query).populate("categoryId", "category");
  res.json({ status: "success", data: products });
});
export const getProductById = tryCatch(async (req, res) => {
  const id = req.params.id;

  const product = await Product.findById(id);

  if (!product) {
    res.status(404).json({ status: "error", message: "product not found" });
  }
  res.status(200).json({ status: "success", data: product });
});
export const updateQuantity = tryCatch(async (req, res) => {
  const id = req.params.id;

  const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
  if (!product) {
    return new CustomError("product not found", 401, 4001);

    // res.status(404).json({ status: "error", data: "product not found" });
  }
  res.status(200).json({ status: "success", data: product });
});
export const deleteProduct = tryCatch(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndDelete(id, { new: true });
  // return new CustomError("product not found", 401, 4001);
  if (!product) {
    return new CustomError("product not found", 401, 4001);

    // res.status(404).json({ status: "error", data: "product not found" });
  }

  res.status(200).json({ status: "success", data: product });
});
export const addProduct = tryCatch(async (req, res) => {
  // try {
  //   const classes = await Classes.findByIdAndUpdate(
  //     req.params.classId,
  //     {
  //       $push: { students: req.body.studentId },
  //     },
  //     {
  //       new: true,
  //     }
  //   );

  //   res.json({ status: "success", data: classes });
  // } catch (err) {
  //   res.status(400).json({ status: "error", data: err });
  // }

  const product = await Product.create(req.body);
  await Category.findByIdAndUpdate(req.body.category, {
    $set: { category: req.body.category },
  });

  await Cart.findByIdAndUpdate(req.body.cart, {
    $push: { cart: req.body.cart },
  });

  res.status(200).json({ status: "success", data: product });
});

// import Student from "../models/studentmodels.js";

// export const getStudents = async (req, res) => {
//   try {
//     const students = await Student.find();
//     res.json({ status: "success", data: students });
//   } catch (err) {
//     res.status(400).json({ status: "error", data: err });
//   }
// };

// export const getStudent = async (req, res) => {
//   try {
//     let query = JSON.stringify(req.query);
//     query = query.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
//     const students = await Student.find(JSON.parse(query));
//     res.json({ status: "success", result: students.length, data: students });
//   } catch (err) {
//     res.status(400).json({ status: "error", data: err.message });
//   }
// };

// export const addStudent = async (req, res) => {
//   try {
//     const student = await Student.create(req.query);
//     res.json({ status: "success", result: 1, data: student });
//   } catch (err) {
//     res.status(400).json({ status: "error", data: err.message });
//   }
// };
// export const getAllProducts = async (req, res) => {
//   try {
//     // let search = req.query.search || "";
//     let query = {};
//     if (req.query.search) {
//       // assuming the search term is passed in the "q" query parameter
//       query = { $text: { $search: req.query.search } };
//     }
//     // { productName: { $regex: search } } // JSON.parse(query) ||
//     // let query = JSON.stringify(req.query.category);
//     query = JSON.parse(JSON.stringify(req.query)).replace(
//       /\b(gte|gt|lt|lte)\b/g,
//       (match) => `$${match}`
//     );
//     const products = await Product.find(query);
//     res.json({ status: "success", data: products });
//   } catch (err) {
//     res.json({ status: "success", data: err });
//   }
// };

// http://localhost:8080/api/products?search=bubble&category=Simple
