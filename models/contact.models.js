import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true, length: 50 },
});
const contact = mongoose.model("contact", contactSchema);
export default contact;
