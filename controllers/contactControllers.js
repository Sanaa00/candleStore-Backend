import path from "path";
import fs from "fs";
import Contact from "../models/contact.models.js";
import { tryCatch } from "../utils/tryCatch.js";
const __dirname = path.resolve();
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/db.json`));

export const addContact = tryCatch(async (req, res) => {
  const contact = await Contact.create(req.body);
  res.status(200).json({ status: "success", data: contact });
});
