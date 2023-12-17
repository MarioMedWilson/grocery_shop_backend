import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import client from "../database/connection.js";


dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const JWT_SECRET = process.env.JWT_SECRET;

export const authUser = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      res.status(404).json("No token found!");
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await client.query(
      `SELECT * FROM "users" WHERE "id"='${decoded.id}'`
    );

    if (!user.rows[0]) {
      return res.status(404).json("No user found!");
    }
    req.userId = user.rows[0].id;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json("Invalid token!");
  }
};
