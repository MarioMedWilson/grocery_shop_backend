
import cryptoRandomString from 'crypto-random-string';

import client from "../database/connection.js";

import sellerModule from "../utils/seller.js";
const { generateToken, verifEmail, validPassword, changePassword } = sellerModule;


const signUp = async (req, res) => {
  const seller = req.body;
  try {
    const verifyToken = await cryptoRandomString({length: 100});
    seller.verifyToken = verifyToken;
    seller.password = await changePassword(seller.password);
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatedAt = createdAt;
    await client.query(
      `INSERT INTO "sellers" ("name", "email", "password", "verifyToken", "createdAt", "updatedAt") VALUES (
        '${seller.name}', 
        '${seller.email}', 
        '${seller.password}', 
        '${seller.verifyToken}',
        '${createdAt}',
        '${updatedAt}')`
    );
    verifEmail(seller);
    res.status(200).json({ message: "Please check your email.", seller });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create seller, email is already used" });
  }
};


const logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const seller = await client.query(
      `SELECT * FROM "sellers" WHERE "email"='${email}'`
    );
    if (seller.rows[0] == null){
      return res.status(404).json({message: "Seller not found. Please sign up"})
    }
    const isPasswordValid = validPassword(seller.rows[0], password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }
    if (seller.rows[0].verifyToken != null){
      res.status(401).json({ message: "Email is not verified" });
      return;
    }
    const token = generateToken(seller.rows[0].id);
    return res.json({ message: "Login successful", seller: seller.rows[0], token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to log in" });
  }
};


const receviedVerifyEmail = async (req, res) => {
  const code = req.params.code
  try{
    const seller = await client.query(
      `SELECT * FROM "sellers" WHERE "verifyToken"='${code}'`
    );
    if (seller.rows[0] == null){
      return res.status(401).json({message: "No Seller found."})
    }
    seller.rows[0].verifyToken = null;
    await client.query(
      `UPDATE "sellers" SET "verifyToken"=null WHERE "verifyToken"='${code}'`
    );
    return res.status(200).json({message: "Successfully verifived the email."});
  }catch (error){
    console.log(error);
    return res.status(401).json({message: "No Seller found."})
  }
};


const resendVerifiyEmail = async (req, res)=> {
  const { email } = req.body;
  if (!email){
    return res.status(404).json({message: "Please insert the email."})
  }
  const seller = await client.query(
    `SELECT * FROM "sellers" WHERE "email"='${email}'`
  );
  if (seller.rows[0] == null){
    return res.status(404).json({message: "No email found."})
  }
  if (seller.rows[0].verifyToken==null){
    return res.status(200).json({message: "Seller email is already verified."})
  }
  verifEmail(seller.rows[0]);
  return res.status(200).json({message: "Email send, please check also the spam."});
};

const updateSeller = async (req, res) => {
  var { name, email, password, confirmPassword } = req.body;
  try {
    const seller = await client.query(
      `SELECT * FROM "sellers" WHERE "id"='${req.sellerId}'`
    );
    if (seller.rows[0] == null){
      return res.status(404).json({ message: "Seller not found." });
    };
    if (password != confirmPassword){
      return res.status(401).json({ message: "Password and confirm password are not the same" });
    };
    if (seller.rows[0].verifyToken != null){
      return res.status(401).json({ message: "Email is not verified" });
    }
    if (seller.rows[0].email != email){
      return res.status(401).json({ message: "Email is not the same" });
    };
    if (name){
      await client.query(
        `UPDATE "sellers" SET "name"='${name}' WHERE "id"='${req.sellerId}'`
      );
    }
    if (password){
      password = await changePassword(password);
      await client.query(
        `UPDATE "sellers" SET "password"='${password}' WHERE "id"='${req.sellerId}'`
      );
    }
    const updatedSeller = await client.query(
      `SELECT * FROM "sellers" WHERE "id"='${req.sellerId}'`
    );
    return res.status(200).json({ message: "Seller updated successfully", seller: updatedSeller.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update seller" });
  }
};


const deleteSeller = async (req, res) => {
  const { email, password } = req.body;
  try {
    const seller = await client.query(
      `SELECT * FROM "sellers" WHERE "id"='${req.sellerId}'`
    );
    if (seller.rows[0] == null){
      return res.status(404).json({ message: "Seller not found." });
    };
    if (seller.rows[0].email != email){
      return res.status(401).json({ message: "Email is not the same" });
    }
    const isPasswordValid = validPassword(seller.rows[0], password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    await client.query(
      `DELETE FROM "sellers" WHERE "id"='${req.sellerId}'`
    );
    return res.status(200).json({ message: "Seller deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete seller" });
  }
};

export default {
  signUp,
  logIn,
  receviedVerifyEmail,
  resendVerifiyEmail,
  updateSeller,
  deleteSeller
}
