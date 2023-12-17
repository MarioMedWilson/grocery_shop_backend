import client from "../database/connection.js";

const countriesData = async (req, res) => {
  try {
    const countries = await client.query(`SELECT * FROM brand_nationalities`);
    return res.status(200).json(countries.rows);
  } catch (error) {
    console.error("Error getting countries:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default {
  countriesData
};
