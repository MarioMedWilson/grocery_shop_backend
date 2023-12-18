
import client from "../database/connection.js";
import countries from "./countries.js";

const addNewProduct = async (req, res) => {
  const {
        product_name, 
        brand_name, 
        brand_nationality_id, 
        price, 
        quantity_in_stock,
        image
      } = req.body;
  if (!product_name){
    return res.status(401).json({messgae: "Product name must be added"})
  }
  if (!brand_name){
    return res.status(401).json({messgae: "Brand name must be added"})
  }
  if (!brand_nationality_id){
    return res.status(401).json({messgae: "Brand nationality must be added"})
  }
  if (!price){
    return res.status(401).json({messgae: "Price must be added"})
  }
  if (!quantity_in_stock){
    return res.status(401).json({messgae: "Quantity must be added"})
  }
  try{
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatedAt = createdAt;
    const product = await client.query(
      `INSERT INTO "products" (
        "product_name", 
        "brand_name", 
        "brand_nationality_id", 
        "price", 
        "quantity_in_stock",
        "user_id",
        "image",
        "createdAt",
        "updatedAt")
         VALUES (
          '${product_name}', 
          '${brand_name}', 
          '${brand_nationality_id}', 
          '${price}', 
          '${quantity_in_stock}', 
          '${req.user_id}',
          '${image}',
          '${createdAt}',
          '${updatedAt}'
          ) RETURNING *`
    );
    
    return res.status(200).json({message: "Product added successfully", product: product.rows[0]});
  }catch (error){
    console.log(error)
    return res.status(500).json({messgae: "Faild to add the product", error: error})
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.body;
  if (!id){
    return res.status(401).json({messgae: "ID product must be added"})
  }
  try {
    const product = await client.query(
      `SELECT * FROM "products" WHERE "id"='${id}'`
    );
    if (product.rows[0] == null){
      return res.status(401).json({message: "No product found"});
    }
    if (product.rows[0].user_id != req.user_id){
      return res.status(402).json({message: "Not authorized to delete this product"});
    }
    await client.query(
      `DELETE FROM "products" WHERE "id"='${id}'`
    );
    return res.status(200).json({message: "Product deleted successfully"})
  }catch(error){
    console.log(error)
    return res.status(500).json({message: "Failed to delete the product"})
  }
};


const updateProduct = async (req, res) => {
  const { id, product_name, brand_name, brand_nationality_id, price, quantity_in_stock, image } = req.body;

  if (!id) {
    return res.status(401).json({ message: "ID product must be added" });
  }
  try {
    const product = await client.query(`SELECT * FROM "products" WHERE "id"='${id}'`);
    if (product.rows[0] == null) {
      return res.status(404).json({ message: "No product found" });
    }
    if (product.rows[0].user_id != req.user_id) {
      return res.status(401).json({ message: "Not authorized to update this product" });
    }
    const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updates = [];
    if (product_name) {
      updates.push(`"product_name"='${product_name}'`);
    }
    if (brand_name) {
      updates.push(`"brand_name"='${brand_name}'`);
    }
    if (brand_nationality_id) {
      updates.push(`"brand_nationality_id"='${brand_nationality_id}'`);
    }
    if (price) {
      updates.push(`"price"='${price}'`);
    }
    if (image) {
      updates.push(`"image"='${image}'`);
    }
    if (quantity_in_stock) {
      updates.push(`"quantity_in_stock"='${quantity_in_stock}'`);
    }

    if (updates.length > 0) {
      await client.query(
        `UPDATE "products" SET ${updates.join(', ')},"updatedAt" = '${updatedAt}' WHERE "id"='${id}'`
      );
    }

    const updatedProduct = await client.query(`SELECT * FROM "products" WHERE "id"='${id}'`);

    return res
      .status(200)
      .json({ message: "Product updated successfully", product: updatedProduct.rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update the product" });
  }
};


const showProducts = async (req, res) => {
  try{
    const products = await client.query(
      `SELECT * FROM "products"`
    );
    const country = await client.query(
      `SELECT * FROM "brand_nationalities"`
    );
    const user = await client.query(
      `SELECT * FROM "users"`
    );
    for (let i = 0; i < products.rows.length; i++){
      for (let j = 0; j < country.rows.length; j++){
        if  (products.rows[i].brand_nationality_id == country.rows[j].id){
          products.rows[i].country = country.rows[j];
        }
      }
      for (let j = 0; j < user.rows.length; j++){
        if  (products.rows[i].user_id == user.rows[j].id){
          products.rows[i].user = {
            id: user.rows[j].id,
            name: user.rows[j].name,
            email: user.rows[j].email
        };
        }
      }
    }
    return res.status(200).json({products: products.rows})
  } catch (error){
    return res.status(500).json({message: "Failed to fetch the products.", error})
  }
};


const showProductsSeller = async (req, res) => {
  if (!req.user_id){
    return res.status(404).json({message: "No authorization to find the products of this seller."}) 
  }
  try{
    const products = await client.query(
      `SELECT * FROM "products" WHERE "user_id"='${req.user_id}'`
    );
    const country = await client.query(
      `SELECT * FROM "brand_nationalities"`
    );
    const user = await client.query(
      `SELECT * FROM "users"`
    );
    for (let i = 0; i < products.rows.length; i++){
      for (let j = 0; j < country.rows.length; j++){
        if  (products.rows[i].brand_nationality_id == country.rows[j].id){
          products.rows[i].country = country.rows[j];
        }
      }
      for (let j = 0; j < user.rows.length; j++){
        if  (products.rows[i].user_id == user.rows[j].id){
          products.rows[i].user = {
            id: user.rows[j].id,
            name: user.rows[j].name,
            email: user.rows[j].email
        };
        }
      }
    }
    return res.status(200).json({products: products.rows})
  }catch (error){
    return res.status(500).json({message: "Failed to fetch the products.", error})
  }
};

export default {
  addNewProduct,
  deleteProduct,
  updateProduct,
  showProducts,
  showProductsSeller
};