import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

const BrandNationality = sequelize.define("brand_nationality",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  }
);

export default BrandNationality;
