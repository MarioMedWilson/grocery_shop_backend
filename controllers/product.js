import Product from "../models/product.js";

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

    const product = await Product.create({product_name, brand_name, brandNationalityId, price, quantityInStock, sellerId: req.sellerId})
    return res.status(200).json({message: "Product added successfully"});
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
    const product = await Product.findOne({where: {id: id}})
    if (product == null){
      return res.status(401).json({message: "No product found"});
    }
    if (product.sellerId != req.sellerId){
      return res.status(402).json({message: "Not authorized to delete this product"});
    }
    await Product.destroy({where: {id:id}})
    return res.status(200).json({message: "Product deleted successfully"})
  }catch(error){
    console.log(error)
    return res.status(500).json({message: "Failed to delete the product"})
  }
};

const updateProduct = async (req, res) => {
  const {
    id,
    product_name, 
    brand_name, 
    brandNationalityId, 
    price, 
    quantityInStock
  } = req.body;
  if (!id){
    return res.status(401).json({messgae: "ID product must be added"})
  }
  try{
    const product = await Product.findOne({where: {id: id}})
    if (product == null){
      return res.status(404).json({message: "No product found"});
    }
    if (product.sellerId != req.sellerId){
      return res.status(401).json({message: "Not authorized to update this product"});
    }
    if (product_name){
      product.product_name = product_name
      await product.save();
    }
    if (brand_name){
      product.brand_name = brand_name
      await product.save();
    }
    if (brandNationalityId){
      product.brandNationalityId = brandNationalityId
      await product.save();
    }
    if (price){
      product.price = price
      await product.save();
    }
    if (quantityInStock){
      product.quantityInStock = quantityInStock
      await product.save();
    }
    return res.status(200).json({message: "Product updated successfully", product})
  }catch(error){
    console.log(error)
    return res.status(500).json({message: "Failed to update the product"})
  }
}

const showProducts = async (req, res) => {
  try{
    const products = await Product.findAll();
    return res.status(200).json({message: "Successfully to fetch products.", products})
  } catch (error){
    return res.status(500).json({message: "Failed to fetch the products."})
  }
};

const showProductsSeller = async (req, res) => {
  if (!req.sellerId){
    return res.status(404).json({message: "No authorization to find the products of this seller."}) 
  }
  try{
    const products = await Product.findAll({where: {sellerId: req.sellerId}});
    return res.status(200).json({message: "Successfully to fetch products.", products})
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