import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Seller from "../models/seller.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_ADMIN;

export const authSeller = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(404).json("No token found!");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const seller = await Seller.findOne({
      where: {
        id: decoded.id,
      },
    });
    if (!seller) {
      return res.status(404).json("No seller found!");
    }
    req.sellerId = seller.id;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json("Invalid token!");
  }
};

export default authSeller;