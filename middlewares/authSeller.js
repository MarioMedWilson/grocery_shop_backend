import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import client from "../database/connection.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const JWT_SECRET = process.env.JWT_SECRET_ADMIN;

export const authSeller = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(404).json({message: "No token found!"});
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const seller = await client.query(
      `SELECT * FROM "sellers" WHERE "id"='${decoded.id}'`
    );
    if (!seller.rows[0]) {
      return res.status(404).json({message: "No seller found!"});
    }
    req.user_id = seller.rows[0].id;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({message: "Invalid token!", error});
  }
};

export default authSeller;