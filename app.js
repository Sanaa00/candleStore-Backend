import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import productsRoutes from "./routers/productsRoutes.js";
import cartRoutes from "./routers/cartRoutes.js";
import userRoutes from "./routers/userRoutes.js";
import contactRoutes from "./routers/contactRoutes.js";
import loginRoutes from "./routers/loginRoutes.js";
// import orderRoutes from "./routers/orderRoutes.js";
import categoryRoutes from "./routers/categoryRouters.js";
import addressRoutes from "./routers/addressRouters.js";
import cartItemRoutes from "./routers/cartItemRouters.js";
import reviewRoutes from "./routers/reviewRoutes.js";
import { connectDB } from "./config/db.js";
import { trimQueryMiddleware } from "./middleware/trimQuery.middleware.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { checkRole, protect } from "./middleware/auth.middleware.js";
import { swaggerSpecs } from "./config/swagger.js";
import swaggerUi from "swagger-ui-express";
import "./strategy/auth.js";
dotenv.config();
// const express = require("express");

connectDB();
const app = express();
app.use(express.json());
app.use(trimQueryMiddleware);
app.use(cors());

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/review", reviewRoutes);
// app.use("/api/order", orderRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/cartItem", cartItemRoutes);

app.use(errorHandler);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

export default app;
