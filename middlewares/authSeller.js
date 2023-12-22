import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import client from "../database/connection.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const JWT_SECRET = process.env.JWT_SECRET_ADMIN;

export const authSeller = async (req, res, next) => {
  l
  try {
    let token;
    
    if (

    // Extract token from the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if the token exists
    if (!token) {
      return res.status(401).json({message: "No token found!"});
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Retrieve seller information from the database
    const seller = await client.query(
      `SELECT * FROM "sellers" WHERE "id"='${decoded.id}'`
    );

    // Check if seller exists
    if (!seller.rows[0]) {
      return res.status(404).json({message: "No seller found!"});
    }

     // Attach the seller's user_id to the request object
    req.user_id = seller.rows[0].id;

     // Continue with the next middleware
    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({message: "Invalid token!", error});
  }
};

export default authSeller;
