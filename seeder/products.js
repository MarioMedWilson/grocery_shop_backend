import client from "../database/connection.js";

const productsData = [
  { product_name: "Banana", brand_name: "Fruits", brandNationalityId: 50, price: 10, quantityInStock: 100, sellerId: 1},
  { product_name: "Apple", brand_name: "Fruits", brandNationalityId: 50, price: 30, quantityInStock: 400, sellerId: 2},
  { product_name: "Orange", brand_name: "Fruits", brandNationalityId: 50, price: 25, quantityInStock: 150, sellerId: 1},
  { product_name: "Berries", brand_name: "Fruits", brandNationalityId: 25, price: 15, quantityInStock: 100, sellerId: 3},
  { product_name: "Melon", brand_name: "Fruits", brandNationalityId: 50, price: 46, quantityInStock: 50, sellerId: 3},
  { product_name: "Lemon/Lime", brand_name: "Fruits", brandNationalityId: 50, price: 6, quantityInStock: 1000, sellerId: 1},
  { product_name: "Pears", brand_name: "Fruits", brandNationalityId: 35, price: 19, quantityInStock: 200, sellerId: 2},
  
  { product_name: "Broccoli", brand_name: "Vegetables", brandNationalityId: 100, price: 19, quantityInStock: 200, sellerId: 2},
  { product_name: "Broccoli", brand_name: "Vegetables", brandNationalityId: 50, price: 22, quantityInStock: 200, sellerId: 3},
  { product_name: "Carrots", brand_name: "Vegetables", brandNationalityId: 50, price: 19, quantityInStock: 200, sellerId: 2},
  { product_name: "Cucumbers", brand_name: "Vegetables", brandNationalityId: 25, price: 19, quantityInStock: 200, sellerId: 2},
  { product_name: "Garlic", brand_name: "Vegetables", brandNationalityId: 23, price: 14, quantityInStock: 220, sellerId: 1},
  { product_name: "Lettuce", brand_name: "Vegetables", brandNationalityId: 50, price: 19, quantityInStock: 0, sellerId: 1},
  { product_name: "Tomatoes", brand_name: "Vegetables", brandNationalityId: 50, price: 19.5, quantityInStock: 20, sellerId: 2},
  { product_name: "Mushrooms", brand_name: "Vegetables", brandNationalityId: 50, price: 23, quantityInStock: 240, sellerId: 2},
  { product_name: "Onions", brand_name: "Vegetables", brandNationalityId: 1, price: 20, quantityInStock: 30, sellerId: 2},
  { product_name: "Peppers", brand_name: "Vegetables", brandNationalityId: 50, price: 12, quantityInStock: 200, sellerId: 1},
  { product_name: "Potatoes", brand_name: "Vegetables", brandNationalityId: 23, price: 14, quantityInStock: 10, sellerId: 3},
  { product_name: "Squash", brand_name: "Vegetables", brandNationalityId: 50, price: 20, quantityInStock: 21, sellerId: 3},

  { product_name: "Beef", brand_name: "Meat", brandNationalityId: 50, price: 20, quantityInStock: 0, sellerId: 2},
  { product_name: "Poultry", brand_name: "Meat", brandNationalityId: 50, price: 20, quantityInStock: 111, sellerId: 3},
  { product_name: "Fish", brand_name: "Meat", brandNationalityId: 50, price: 20, quantityInStock: 101, sellerId: 3},
  { product_name: "Bacon", brand_name: "Meat", brandNationalityId: 50, price: 20, quantityInStock: 210, sellerId: 2},
  { product_name: "Sausage", brand_name: "Meat", brandNationalityId: 50, price: 20, quantityInStock: 201, sellerId: 3},
  { product_name: "Chicken", brand_name: "Meat", brandNationalityId: 25, price: 20, quantityInStock: 26, sellerId: 1},
]


const seedProducts = async () => {
  try {
    for (const product of productsData) {
      var { product_name, brand_name, brandNationalityId, price, quantityInStock, sellerId } = product;
      const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const updatedAt = createdAt;
      const query = `
        INSERT INTO products ("product_name", "brand_name", "brandNationalityId", "price", "quantityInStock", "sellerId", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;
      await client.query(query, [product_name, brand_name, brandNationalityId, price, quantityInStock, sellerId, createdAt, updatedAt]);
    }

    console.log("Products seeded successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
};

export default seedProducts;
