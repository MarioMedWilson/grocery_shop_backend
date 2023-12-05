import sequelize from "./connection.js";
import User from "../models/user.js";
import Product from "../models/product.js";

import Cart from "../models/cart.js";
import CartItem from "../models/cartItems.js";

import { Sequelize } from "sequelize";
import Seller from "../models/seller.js";
import BrandNationality from "../models/nationality.js";

const createTables = () => {
  sequelize
    .sync({ force: true })
    .then(() => {
      console.log("Tables have been created");
      // const queryInterface = sequelize.getQueryInterface();
      // seed.up(queryInterface, Sequelize);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Purchase.belongsTo(User, { foreignKey: "user_id", as: "user" });
// User.hasMany(Purchase, { foreignKey: "user_id", as: "purchases" });

// Cart.belongsTo(User, {foreignKey: "user_id", as: "user"});
// User.hasMany(Cart, {foreignKey: "user_id", as: "cart"});

// Product.belongsTo(User, {foreignKey: "user_id", as: "user"});
// User.hasMany(Product, {foreignKey: "user_id", as: "product"});

// Product.belongsTo(Cart, {foreignKey: "product_id", as: "cart"});
// Cart.hasMany(Product, {foreignKey: "product_id", as: "product"});

// Purchase.belongsTo(Product, { foreignKey: "product_id", as: "product" });
// Product.hasMany(Purchase, { foreignKey: "product_id", as: "purchases" });

User.hasMany(Cart);
Cart.belongsTo(User);


Cart.hasMany(CartItem);
CartItem.belongsTo(Cart);

Product.hasMany(CartItem);
CartItem.belongsTo(Product);

BrandNationality.hasMany(Product);
Product.belongsTo(BrandNationality);

Seller.hasMany(Product);
Product.belongsTo(Seller);

export default createTables;
