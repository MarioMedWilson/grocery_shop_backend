import Seller from "../models/seller.js";
import cryptoRandomString from 'crypto-random-string';


const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const verifyToken = await cryptoRandomString({length: 100});
    
    const seller = await Seller.create({ name, email, password, verifyToken });


    seller.verifEmail(seller);
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
    const seller = await Seller.findOne({ where: { email } });

    if (!seller) {
      res.status(404).json({ message: "Seller not found. Please sign up" });
      return;
    }

    const isPasswordValid = seller.validPassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }
    if (seller.verifyToken != null){
      res.status(401).json({ message: "Email is not verified" });
      return;
    }

    const token = seller.generateToken();
    res.json({ message: "Login successful", seller, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to log in" });
  }
};

const verifEmail = async (req, res) => {
  const code = req.params.code
  const seller = await Seller.findOne({ where: { verifyToken: code } });
  if (seller === null){
    return res.status(404).json({message: "No Seller found."})
  }
  seller.verifyToken = null;
  await seller.save();
  return res.status(200).json({message: "Successfully verifived the email."});
};

const resendVerifiy = async (req, res)=> {
  const { email } = req.body;
  if (!email){
    return res.status(404).json({message: "Please insert the email."})
  }
  const seller = await Seller.findOne({ where: { email } });
  if (seller == null){
    return res.status(404).json({message: "No email found."})
  }
  if (seller.verifyToken==null){
    return res.status(200).json({message: "User email is already verified."})
  }
  seller.verifEmail(seller);
  return res.status(200).json({message: "Email send, please check also the spam."});
};

export default {
  signUp,
  logIn,
  verifEmail,
  resendVerifiy,
}
