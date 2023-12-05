import Seller from "../models/seller.js";

const sellersData = [
  { name: "Mario", email: "mario.medhat@ejust.edu.eg", password: "wilson@2001", verifyToken: null},
  { name: "Mario Medhat", email: "mariomwilson220011@gmail.com", password: "wilson@2001", verifyToken: null},
  { name: "Mario Medhat", email: "mariowilson@gmail.com", password: "wilson@2001", verifyToken: null},
]

const seedSellers = async () => {
  try {
    await Seller.sync();
    await Seller.bulkCreate(sellersData, {individualHooks: true});
    console.log('Sellers seeded successfully.');
  } catch (error) {
    console.error('Error seeding sellers:', error);
  } finally {
    await Seller.sequelize.close();
  }
};

export default seedSellers;
