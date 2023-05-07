import { Router } from "express";
import { getAddress, AddAddress } from "../controllers/addressControllers.js";

const router = Router();
router.route("/").get(getAddress).post(AddAddress);

export default router;
