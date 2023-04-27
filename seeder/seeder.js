import { connectDB } from "../config/db.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Product from "../models/products.models.js";

dotenv.config();

connectDB();
const __dirname = path.resolve();

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, `/seeder/data/product.json`))
);

const importData = async () => {
  try {
    const t = await Product.create(data);
    console.log("import was successful");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log("delete was successfull");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") deleteData();
