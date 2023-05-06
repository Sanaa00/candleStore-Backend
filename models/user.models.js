import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  //midlleware moongose
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, default: "user" },
  cart: { type: mongoose.Types.ObjectId, ref: "cart" },
});
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const user = mongoose.model("user", userSchema);
export default user;
