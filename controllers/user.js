
import cryptoRandomString from 'crypto-random-string';
import userModule from "../utils/user.js";

const { generateToken, verifEmail, validPassword, changePassword } = userModule;
import client from "../database/connection.js";
import bcrypt from "bcrypt";


const signUp = async (req, res) => {
  const user = req.body;
  try {
    const verify_token = await cryptoRandomString({length: 100});
    user.verify_token = verify_token;
    user.password = await changePassword(user.password);
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatedAt = createdAt;
    await client.query(
      `INSERT INTO "users" ("name", "email", "password", "verify_token", "createdAt", "updatedAt") VALUES (
        '${user.name}', 
        '${user.email}', 
        '${user.password}', 
        '${user.verify_token}',
        '${createdAt}',
        '${updatedAt}')`
    );
    verifEmail(user);
    res.status(200).json({ message: "Please check your email.", user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create user, email is already used" });
  }
};

const logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await client.query(
      `SELECT * FROM "users" WHERE "email"='${email}'`
    );
    if (user.rows[0] == null){
      return res.status(404).json({message: "User not found. Please sign up"})
    }
    const isPasswordValid = validPassword(user.rows[0], password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }
    if (user.rows[0].verify_token != null){
      res.status(401).json({ message: "Email is not verified" });
      return;
    }
    const token = generateToken(user.rows[0].id);
    return res.json({ message: "Login successful", user: user.rows[0], token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to log in", error });
  }
}


const receviedVerifyEmail = async (req, res) => {
  const code = req.params.code
  try{
    const user = await client.query(
      `SELECT * FROM "users" WHERE "verify_token"='${code}'`
    );
    if (user.rows[0] == null){
      return res.status(401).json({message: "No User found."})
    }
    user.rows[0].verify_token = null;
    await client.query(
      `UPDATE "users" SET "verify_token"=null WHERE "verify_token"='${code}'`
    );
    return res.status(200).json({message: "Successfully verifived the email."});
  }catch (error){
    console.log(error);
    return res.status(401).json({message: "No User found."})
  }
}

const resendVerifiyEmail = async (req, res)=> {
  const { email } = req.body;
  if (!email){
    return res.status(404).json({message: "Please insert the email."})
  }
  const user = await client.query(
    `SELECT * FROM "users" WHERE "email"='${email}'`
  );
  if (user.rows[0] == null){
    return res.status(404).json({message: "No email found."})
  }
  if (user.rows[0].verify_token==null){
    return res.status(200).json({message: "User email is already verified."})
  }
  verifEmail(user.rows[0]);
  return res.status(200).json({message: "Email send, please check also the spam."});
};

const updateUser = async (req, res) => {
  var { name, email, password, confirmPassword } = req.body;
  try {
    const user = await client.query(
      `SELECT * FROM "users" WHERE "id"='${req.user_id}'`
    );
    if (user.rows[0] == null){
      return res.status(404).json({ message: "User not found." });
    };
    if (password != confirmPassword){
      return res.status(401).json({ message: "Password and confirm password are not the same" });
    };
    if (user.rows[0].verify_token != null){
      return res.status(401).json({ message: "Email is not verified" });
    }
    if (user.rows[0].email != email){
      return res.status(401).json({ message: "Email is not the same" });
    };
    if (name){
      await client.query(
        `UPDATE "users" SET "name"='${name}' WHERE "id"='${req.user_id}'`
      );
    }
    if (password){
      password = await changePassword(password);
      await client.query(
        `UPDATE "users" SET "password"='${password}' WHERE "id"='${req.user_id}'`
      );
    }
    const updatedUser = await client.query(
      `SELECT * FROM "users" WHERE "id"='${req.user_id}'`
    );
    return res.status(200).json({ message: "User updated successfully", user: updatedUser.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await client.query(
      `SELECT * FROM "users" WHERE "id"='${req.user_id}'`
    );
    if (user.rows[0] == null){
      return res.status(404).json({ message: "User not found." });
    };
    if (user.rows[0].email != email){
      return res.status(401).json({ message: "Email is not the same" });
    }
    const isPasswordValid = validPassword(user.rows[0], password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    await client.query(
      `DELETE FROM "users" WHERE "id"='${req.user_id}'`
    );
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete user" });
  }
}

export default {
  signUp,
  logIn,
  receviedVerifyEmail,
  resendVerifiyEmail,
  updateUser,
  deleteUser
}
