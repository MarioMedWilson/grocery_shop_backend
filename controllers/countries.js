import client from "../database/connection.js";

const countriesData = async (req, res) => {
  try {
    // Retrieve countries data from the database
    const result = await client.query(`SELECT * FROM brand_nationalities`);
    
    // Extract the rows from the result
    const countries = result.rows;

    // Respond with the countries' data
    return res.status(200).json(countries);
  } catch (error) {
    
    // Log the error for debugging purposes
    console.error("Error getting countries:", error);

    // Respond with a standardized error message
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default {
  countriesData
};

