// Used to create tables in the database
import client from "./connection.js";


const createTables = async () => {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS "brand_nationalities" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(100) NOT NULL UNIQUE,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )`
    );
    await client.query(
      `CREATE TABLE IF NOT EXISTS "sellers" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(100) NOT NULL,
        "email" VARCHAR(100) NOT NULL UNIQUE,
        "password" VARCHAR(100) NOT NULL,
        "verifyToken" VARCHAR(100),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )`
    );
    await client.query(
      `CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(100) NOT NULL,
        "email" VARCHAR(100) NOT NULL UNIQUE,
        "password" VARCHAR(100) NOT NULL,
        "verifyToken" VARCHAR(100),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )`
    );
    await client.query(
      `CREATE TABLE IF NOT EXISTS "products" (
        "id" SERIAL PRIMARY KEY,
        "product_name" VARCHAR(100) NOT NULL,
        "brand_name" VARCHAR(100) NOT NULL,
        "quantityInStock" INTEGER NOT NULL,
        "price" DECIMAL(10,3) NOT NULL,
        "sellerId" INTEGER REFERENCES "sellers"("id"),
        "brandNationalityId" INTEGER REFERENCES "brand_nationalities"("id"),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )`
    );
    await client.query(
      `CREATE TABLE IF NOT EXISTS "shopping_carts" (
        "id" SERIAL PRIMARY KEY,
        "totalPrice" INTEGER NOT NULL,
        "userId" INTEGER REFERENCES "users"("id"),
        "payment" BOOLEAN DEFAULT FALSE,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )`
    );
    await client.query(
      `CREATE TABLE IF NOT EXISTS "shopping_cart_items" (
        "id" SERIAL PRIMARY KEY,
        "productId" INTEGER REFERENCES "products"("id"),
        "shoppingCartId" INTEGER REFERENCES "shopping_carts"("id"),
        "quantity" INTEGER NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )`
    );
    console.log("Tables created successfully!");
    } catch (error) {
    console.log(error);
  }
};

export default createTables;