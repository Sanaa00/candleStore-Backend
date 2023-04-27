import { Router } from "express";
import { addToOrder, getOrder } from "../controllers/orderControllers.js";

const router = Router();
router.route("/").get(getOrder).post(addToOrder);
export default router;
