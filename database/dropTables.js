import client from "./connection.js";

const dropTables = async () => {
  try {
    await client.query(`
    DROP TABLE IF EXISTS shopping_cart_items;
    DROP TABLE IF EXISTS shopping_carts;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS sellers;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS brand_nationalities;
    `);
    console.log("Tables dropped successfully!");
  } catch (error) {
    console.error("Error dropping tables:", error);
  }
}

export default dropTables;