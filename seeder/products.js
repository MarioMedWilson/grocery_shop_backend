import client from "../database/connection.js";

const productsData = [
  { product_name: "Banana", brand_name: "Fruits", brand_nationality_id: 50, price: 10, quantity_in_stock: 100, user_id: 1,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FBanana.jpg?alt=media&token=5dcc7ff9-decb-4ee6-bca3-77b6aded6326"},
  { product_name: "Apple", brand_name: "Fruits", brand_nationality_id: 50, price: 30, quantity_in_stock: 400, user_id: 2,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FApple.jpeg?alt=media&token=8f628871-ffa8-42b1-b9ad-d71c3a5d0f8f"},
  { product_name: "Orange", brand_name: "Fruits", brand_nationality_id: 50, price: 25, quantity_in_stock: 150, user_id: 1,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FOrange.jpeg?alt=media&token=cb87025b-e3f1-45d1-95bc-2fb9f3c563d0"},
  { product_name: "Berries", brand_name: "Fruits", brand_nationality_id: 25, price: 15, quantity_in_stock: 100, user_id: 3,
    image: "https://console.firebase.google.com/u/0/project/grocery-shop-de/storage/grocery-shop-de.appspot.com/files/~2Fimages#:~:text=Name-,Berries.jpeg,-Size"},
  { product_name: "Melon", brand_name: "Fruits", brand_nationality_id: 50, price: 46, quantity_in_stock: 50, user_id: 3,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FMelon.jpeg?alt=media&token=9581c5a8-0606-4dfa-965c-8fc31ddbd7d7"},
  { product_name: "Lemon/Lime", brand_name: "Fruits", brand_nationality_id: 50, price: 6, quantity_in_stock: 1000, user_id: 1,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FLemon.jpeg?alt=media&token=faa8b9de-fd59-4139-b0fd-157adf4414a9"},
  { product_name: "Pears", brand_name: "Fruits", brand_nationality_id: 35, price: 19, quantity_in_stock: 200, user_id: 2,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FPears.avif?alt=media&token=76323390-b872-4216-b8df-c5f7807b5794"},
  
  { product_name: "Broccoli", brand_name: "Vegetables", brand_nationality_id: 100, price: 19, quantity_in_stock: 200, user_id: 2,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FBroccoli.jpeg?alt=media&token=b41bfd5e-b326-4f89-b0f5-a65abc78208e"},
  { product_name: "Carrots", brand_name: "Vegetables", brand_nationality_id: 50, price: 19, quantity_in_stock: 200, user_id: 2,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FCarrots.jpeg?alt=media&token=9707cbeb-8bbe-4412-ad46-94e51a8ce70a"},
  { product_name: "Cucumbers", brand_name: "Vegetables", brand_nationality_id: 25, price: 19, quantity_in_stock: 200, user_id: 2,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FCucumbers.jpeg?alt=media&token=4f7c2d66-522b-4442-8f28-2e27652eac66"},
  { product_name: "Garlic", brand_name: "Vegetables", brand_nationality_id: 23, price: 14, quantity_in_stock: 220, user_id: 1,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FGarlic.jpeg?alt=media&token=18b34fe4-ae05-4a44-bac1-df361e13c0dd"},
  { product_name: "Lettuce", brand_name: "Vegetables", brand_nationality_id: 50, price: 19, quantity_in_stock: 0, user_id: 1,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2Flettuce.webp?alt=media&token=ebb178eb-2729-4293-a2c2-cbb949cebcc5"},
  { product_name: "Tomatoes", brand_name: "Vegetables", brand_nationality_id: 50, price: 19.5, quantity_in_stock: 20, user_id: 2,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FTomatoes.jpeg?alt=media&token=651a32bd-213d-42f1-9e37-f6490a79ce2e"},
  { product_name: "Mushrooms", brand_name: "Vegetables", brand_nationality_id: 50, price: 23, quantity_in_stock: 240, user_id: 2,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FMushrooms.jpeg?alt=media&token=3d14b630-7d07-4ad5-879e-7afce7541606"},
  { product_name: "Onions", brand_name: "Vegetables", brand_nationality_id: 1, price: 20, quantity_in_stock: 30, user_id: 2,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FOnions.jpeg?alt=media&token=cfe14149-70ae-47d7-94b0-2ae75d101b8f"},
  { product_name: "Peppers", brand_name: "Vegetables", brand_nationality_id: 50, price: 12, quantity_in_stock: 200, user_id: 1,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FPeppers.jpeg?alt=media&token=069e654f-e788-48b0-8df6-8b44ebb00c8d"},
  { product_name: "Potatoes", brand_name: "Vegetables", brand_nationality_id: 23, price: 14, quantity_in_stock: 10, user_id: 3,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FPotatoes.jpeg?alt=media&token=0926509b-cc23-4b4e-91df-e624672d2377"},
  { product_name: "Squash", brand_name: "Vegetables", brand_nationality_id: 50, price: 20, quantity_in_stock: 21, user_id: 3,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FSquash.jpeg?alt=media&token=a4170017-0750-47f6-b350-18b0ab6e4949"},

  { product_name: "Beef", brand_name: "Meat", brand_nationality_id: 50, price: 20, quantity_in_stock: 0, user_id: 2,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FBeef.jpeg?alt=media&token=3cb39082-85ae-4244-ad13-f9cfacb0265a"},
  { product_name: "Poultry", brand_name: "Meat", brand_nationality_id: 50, price: 20, quantity_in_stock: 111, user_id: 3,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FPoultry.jpeg?alt=media&token=7e9ef42c-b82c-4fc9-a575-2285e2f6787b"},
  { product_name: "Fish", brand_name: "Meat", brand_nationality_id: 50, price: 20, quantity_in_stock: 101, user_id: 3,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FFish.jpeg?alt=media&token=3eb57d18-6034-411a-bae8-b2021624a0d0"},
  { product_name: "Bacon", brand_name: "Meat", brand_nationality_id: 50, price: 20, quantity_in_stock: 210, user_id: 2,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FBacon.webp?alt=media&token=1d4e4a73-7834-4286-8fcd-c64e252ac9f8"},
  { product_name: "Sausage", brand_name: "Meat", brand_nationality_id: 50, price: 20, quantity_in_stock: 201, user_id: 3,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FSausage.jpeg?alt=media&token=dd9cafbe-ee0e-4ff1-990c-b89a193514bc"},
  { product_name: "Chicken", brand_name: "Meat", brand_nationality_id: 25, price: 20, quantity_in_stock: 26, user_id: 1,
    image: "https://firebasestorage.googleapis.com/v0/b/grocery-shop-de.appspot.com/o/images%2FChicken.webp?alt=media&token=f5b689d2-d248-4c82-9611-65893bd5a7a8"},
]


const seedProducts = async () => {
  try {
    for (const product of productsData) {
      var { product_name, brand_name, brand_nationality_id, price, quantity_in_stock, image, user_id } = product;
      const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const updatedAt = createdAt;
      const query = `
        INSERT INTO products ("product_name", "brand_name", "brand_nationality_id", "price", "quantity_in_stock", "image", "user_id", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
      await client.query(query, [product_name, brand_name, brand_nationality_id, price, quantity_in_stock, image, user_id, createdAt, updatedAt]);
    }

    console.log("Products seeded successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
};

export default seedProducts;
