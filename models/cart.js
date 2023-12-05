import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

const Cart = sequelize.define("shopping_carts",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    timestamps: true,
  }
);

export default Cart;
