import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const signup = async (req, res, next) => {
  const { name, email, password } = req?.body;
  console.log(name, email, password);
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hashSync(password);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
  } catch (error) {
    console.error(error);
  }
  return res.status(201).json({ message: "User Created" });
};

const login = async (req, res, next) => {
  const { email, password } = req?.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist. SignUp Please.." });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenitals does not match" });
    }
    console.log(process.env.SECRTE_KEY);
    const token = jwt.sign({ id: user._id }, process.env.SECRTE_KEY, {
      expiresIn: "1hr",
    });
    return res.status(200).json({
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
  }
};

export { signup, login };
