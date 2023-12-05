import User from "../models/user.js";

const usersData = [
  { name: "Mario", email: "mario.medhat@ejust.edu.eg", password: "wilson@2001", verifyToken: null},
  { name: "Mario Medhat", email: "mariomwilson220011@gmail.com", password: "wilson@2001", verifyToken: null},
  { name: "Mario Medhat", email: "mariowilson@gmail.com", password: "wilson@2001", verifyToken: null},
]

const seedUsers = async () => {
  try {
    await User.sync();
    await User.bulkCreate(usersData, {individualHooks: true});
    console.log('Users seeded successfully.');
  } catch (error) {
    console.error('Error seeding Users:', error);
  } finally {
    await User.sequelize.close();
  }
};

export default seedUsers;
