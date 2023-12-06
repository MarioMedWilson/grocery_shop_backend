import User from "../models/user.js";
import cryptoRandomString from 'crypto-random-string';

import bcrypt from "bcrypt";


const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const verifyToken = await cryptoRandomString({length: 100});
    
    const user = await User.create({ name, email, password, verifyToken });
    // const token = user.generateToken();

    user.verifEmail(user);
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
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User not found. Please sign up" });
      return;
    }
    // const isPasswordValid = bcrypt.compareSync(password, user.password);
    const isPasswordValid = user.validPassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }
    if (user.verifyToken != null){
      res.status(401).json({ message: "Email is not verified" });
      return;
    }

    const token = user.generateToken();
    res.json({ message: "Login successful", user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to log in" });
  }
};

const verifEmail = async (req, res) => {
  const code = req.params.code
  const user = await User.findOne({ where: { verifyToken: code } });
  if (user === null){
    return res.status(401).json({message: "No User found."})
  }
  user.verifyToken = null;
  await user.save();
  return res.status(200).json({message: "Successfully verifived the email"});
};

const resendVerifiy = async (req, res)=> {
  const { email } = req.body;
  if (!email){
    return res.status(404).json({message: "Please insert the email."})
  }
  const user = await User.findOne({ where: { email } });
  if (user == null){
    return res.status(404).json({message: "No email found."})
  }
  if (user.verifyToken==null){
    return res.status(200).json({message: "User email is already verified."})
  }
  user.verifEmail(user);
  return res.status(200).json({message: "Email send, please check also the spam."});
};

const updateUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    };
    if (password != confirmPassword){
      res.status(401).json({ message: "Password and confirm password are not the same" });
      return;
    };
    if (user.verifyToken != null){
      res.status(401).json({ message: "Email is not verified" });
      return;
    }
    if (user.email != email){
      res.status(401).json({ message: "Email is not the same" });
      return;
    };
    if (name){
      user.name = name;
      await user.save();
    }
    if (password){
      user.password = password;
      await user.save();
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    };
    if (user.email != email){
      res.status(401).json({ message: "Email is not the same" });
      return;
    }
    const isPasswordValid = user.validPassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }
    await user.destroy();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

export default {
  signUp,
  logIn,
  verifEmail,
  resendVerifiy,
  updateUser,
  deleteUser
}
