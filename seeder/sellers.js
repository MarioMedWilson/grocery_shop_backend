import client from "../database/connection.js";
import Seller from "../utils/seller.js";

const sellersData = [
  { name: "Mario", email: "mario.medhat@ejust.edu.eg", password: "abcd@1234", verifyToken: null},
  { name: "Mario Medhat", email: "mariomwilson220011@gmail.com", password: "abcd@1234", verifyToken: null},
  { name: "Mario Medhat", email: "mariowilson@gmail.com", password: "abcd@1234", verifyToken: null},
]


const seedSellers = async () => {
  try {
    for (const seller of sellersData) {
      var { name, email, password, verifyToken } = seller;
      const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const updatedAt = createdAt;
      password = await Seller.changePassword(password);
      const query = `
        INSERT INTO sellers ("name", "email", "password", "verifyToken", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await client.query(query, [name, email, password, verifyToken, createdAt, updatedAt]);
    }

    console.log("Sellers seeded successfully!");
  } catch (error) {
    console.error("Error seeding sellers:", error);
  }
};

export default seedSellers;
