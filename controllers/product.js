
import client from "../database/connection.js";

const addNewProduct = async (req, res) => {
  const {
        product_name, 
        brand_name, 
        brandNationalityId, 
        price, 
        quantityInStock
      } = req.body;
  if (!product_name){
    return res.status(401).json({messgae: "Product name must be added"})
  }
  if (!brand_name){
    return res.status(401).json({messgae: "Brand name must be added"})
  }
  if (!brandNationalityId){
    return res.status(401).json({messgae: "Brand nationality must be added"})
  }
  if (!price){
    return res.status(401).json({messgae: "Price must be added"})
  }
  if (!quantityInStock){
    return res.status(401).json({messgae: "Quantity must be added"})
  }
  try{
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatedAt = createdAt;
    const product = await client.query(
      `INSERT INTO "products" (
        "product_name", 
        "brand_name", 
        "brandNationalityId", 
        "price", 
        "quantityInStock", 
        "sellerId",
        "createdAt",
        "updatedAt")
         VALUES (
          '${product_name}', 
          '${brand_name}', 
          '${brandNationalityId}', 
          '${price}', 
          '${quantityInStock}', 
          '${req.sellerId}',
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
    if (product.rows[0].sellerId != req.sellerId){
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
  const { id, product_name, brand_name, brandNationalityId, price, quantityInStock } = req.body;

  if (!id) {
    return res.status(401).json({ message: "ID product must be added" });
  }
  try {
    const product = await client.query(`SELECT * FROM "products" WHERE "id"='${id}'`);
    if (product.rows[0] == null) {
      return res.status(404).json({ message: "No product found" });
    }
    if (product.rows[0].sellerId != req.sellerId) {
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
    if (brandNationalityId) {
      updates.push(`"brandNationalityId"='${brandNationalityId}'`);
    }
    if (price) {
      updates.push(`"price"='${price}'`);
    }
    if (quantityInStock) {
      updates.push(`"quantityInStock"='${quantityInStock}'`);
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
    return res.status(200).json({message: "Successfully to fetch products.", products: products.rows})
  } catch (error){
    return res.status(500).json({message: "Failed to fetch the products."})
  }
};


const showProductsSeller = async (req, res) => {
  if (!req.sellerId){
    return res.status(404).json({message: "No authorization to find the products of this seller."}) 
  }
  try{
    const products = await client.query(
      `SELECT * FROM "products" WHERE "sellerId"='${req.sellerId}'`
    );
    return res.status(200).json({message: "Successfully to fetch products.", products: products.rows})
  }catch (error){
    return res.status(500).json({message: "Failed to fetch the products."})
  }
};

export default {
  addNewProduct,
  deleteProduct,
  updateProduct,
  showProducts,
  showProductsSeller
};