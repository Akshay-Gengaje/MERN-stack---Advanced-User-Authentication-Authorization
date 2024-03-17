import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
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

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token does not exist" });
  jwt.verify(token, process.env.SECRTE_KEY, (err, user) => {
    if (err) return res.status(401).json({ message: "Invalid Token" });
    console.log(user.id);
    req.id = user.id;
    next();
  });
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.id, "-password");
    if (!user) return res.status(404).json({ message: "User not found!" });
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
  }
};
export { signup, login, verifyToken, getUser };
