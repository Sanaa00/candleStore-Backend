import { Router } from "express";
import { addContact } from "../controllers/contactControllers.js";
const router = Router();

router.route("/").post(addContact);

export default router;
