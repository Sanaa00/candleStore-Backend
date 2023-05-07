import { Router } from "express";
import { addContact, getContact } from "../controllers/contactControllers.js";
const router = Router();

router.route("/").post(addContact).get(getContact);

export default router;
