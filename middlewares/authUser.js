import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authUser = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    res.status(404).json("No token found!");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      return res.status(404).json("No user found!");
    }
    req.userId = user.id;
    return next();
  } catch (error) {
    return res.status(401).json("Invalid token!");
  }
};
