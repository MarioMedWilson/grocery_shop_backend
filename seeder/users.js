import client from "../database/connection.js";
import User from "../utils/user.js";

const usersData = [
  { name: "Mario", email: "mario.medhat@ejust.edu.eg", password: "abcd@1234", verify_token: null},
  { name: "Mario Medhat", email: "mariomwilson220011@gmail.com", password: "abcd@1234", verify_token: null},
  { name: "Mario Medhat", email: "mariowilson@gmail.com", password: "abcd@1234", verify_token: null},
]


const seedUsers = async () => {
  try {
    for (const user of usersData) {
      var { name, email, password, verify_token } = user;
      password = await User.changePassword(password);
      const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const updatedAt = createdAt;
      const query = `
        INSERT INTO users ("name", "email", "password", "verify_token", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await client.query(query, [name, email, password, verify_token, createdAt, updatedAt]);
    }

    console.log("Users seeded successfully!");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

export default seedUsers;
