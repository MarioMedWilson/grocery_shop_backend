import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {google} from 'googleapis';
import nodemailer from 'nodemailer';

import sequelize from "../database/connection.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verifyToken: {
    type: DataTypes.STRING
  }
}, {
  hooks: {
    beforeSave: async (user) => {
      if (user.changed("password")) {
        const salt = await bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
    afterUpdate: async (user) => {
      if (user.changed("password")) {
        const salt = await bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
  },
});

User.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

User.prototype.generateToken = function(){
  const payload = {
    id: this.id,
  };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h',
  });
  return token
}

User.prototype.verifEmail = async function (data){
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
      subject: 'Verify Your Account User',
      html: `<!DOCTYPE html>
      <html>
      <body>
        <p>Dear Mr./Ms.</p>
        <p>Thank you for signing up with our service. To complete your registration, of User <strong> ${data.name}</strong>
        please click the link below to verify your email address:</p>
        <p><a href="${`${api}/user/verify/${data.verifyToken}`}" target="_blank">Verify Email Address</a></p>
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

// const token = user.generateToken();
// console.log(token);

export default User;
