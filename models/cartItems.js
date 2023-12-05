import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

const CartItem = sequelize.define("shopping_cart_items",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: true,
  }
);

export default CartItem;
