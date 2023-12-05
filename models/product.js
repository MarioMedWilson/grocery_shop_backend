import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

const Product = sequelize.define("products",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    brand_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    quantityInStock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: true,
  }
);

export default Product;
