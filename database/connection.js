import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    port: process.env.DATABASE_PORT,
  }
);

export default sequelize;
