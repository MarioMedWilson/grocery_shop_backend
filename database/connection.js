
import pkg from 'pg';
const { Client } = pkg;

import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const client = new Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

client.connect();



export default client;
