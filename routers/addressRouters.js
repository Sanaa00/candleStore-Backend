import { Router } from "express";
import { getAddress, AddAddrss } from "../controllers/addressControllers.js";

const router = Router();
router.route("/").get(getAddress).post(AddAddrss);

export default router;
