
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {google} from 'googleapis';
import nodemailer from 'nodemailer';

import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const JWT_SECRET = process.env.JWT_SECRET_ADMIN;

const changePassword = async (password) => {
  const salt = await bcrypt.genSaltSync(10);
  password = bcrypt.hashSync(password, salt);
  return password;
};

const validPassword =  (seller, password) => {
  return bcrypt.compareSync(password, seller.password);
};

const generateToken = (id) => {
  const payload = {
    id: id,
  };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h',
  });
  return token
}

const verifEmail = async function (data){
  const api = process.env.API_BASE_URL;
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLEINT_SECRET = process.env.CLEINT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'mario.m.wilson2001@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const mailOptions = {
      from: 'Mario Medhat <mario.m.wilson2001@gmail.com>',
      to: data.email,
      subject: 'Verify Your Account Seller',
      html: `<!DOCTYPE html>
      <html>
      <body>
        <p>Dear Mr./Ms.</p>
        <p>Thank you for signing up with our service. To complete your registration, of User <strong> ${data.name}</strong>
        please click the link below to verify your email address:</p>
        <p><a href="${`${api}/seller/verify/${data.verifyToken}`}" target="_blank">Verify Email Address</a></p>
        <p>If you did not sign up for this service, you can safely ignore this email.</p>
        <p>Best regards,</p>
        <p>Grocery Shop</p>
      </body>
      </html>`,
    };
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};


export default {
  generateToken,
  verifEmail,
  validPassword,
  changePassword
};
