// import Cart from "../models/cart.js";
import client from "../database/connection.js";

// Function to get the current date and time in a consistent format
const getCurrentDateTime = () => {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
};

const createCart = async (user_id) => {
  try {
    var cart = await client.query(
      `SELECT * FROM "shopping_carts" WHERE "user_id"='${user_id}' AND "payment"='${false}'`
    );
    if (!cart.rows[0]){
      const createdAt = getCurrentDateTime();
      const updatedAt = createdAt;
      cart = await client.query(
        `INSERT INTO "shopping_carts" ("total_price", "user_id", "createdAt", "updatedAt") VALUES (
          '${0}', 
          '${user_id}',
          '${createdAt}', 
          '${updatedAt}') RETURNING *`
      );
    }
    return cart;
  }catch (error){
    console.log(error)
    return false
  }
};

const updateCart = async (id, total_price) => {
  if (!id){
    return false
  }
  try{
    const updatedAt = getCurrentDateTime();
    const cart = await client.query(
      `UPDATE "shopping_carts" SET "total_price"='${total_price}', "updatedAt"='${updatedAt}' WHERE "id"='${id}' RETURNING *`
    );
    return cart;
  } catch (error){
    console.log(error)
    return false
  }
};

// endpoint for payment confirmation
// const paymentConfirm = async()

const payment = async (req, res) => {
  if (!req.user_id){
    return res.status(404).json({message: "No authorization to pay this cart."});
  }
  const { id } = req.body;
  if (!id){
    return res.status(404).json({message: "Please identify which cart to pay"})
  }
  try{
    // const cart = await Cart.findOne({where: {id: id, user_id: req.user_id}});
    const cart = await client.query(
      `SELECT * FROM "shopping_carts" WHERE "id"='${id}' AND "user_id"='${req.user_id}'`
    );
    if (!cart.rows[0]){
      return res.status(404).json({message: "Cart not found"});
    }
    await client.query(
      `UPDATE "shopping_carts" SET "payment"='${true}' WHERE "id"='${id}' RETURNING *`
    );
    return res.status(200).json({message: "Successfully paid the cart"});
  } catch (error){
    console.log(error)
    return res.status(500).json({message: "Failed to pay cart", error})
  }
};

const showUserCarts = async (req, res) => {
  if (!req.user_id){
    return res.status(404).json({message: "No authorization to show the carts of this user."});
  }
  try{
    const cart = await client.query(
      `SELECT * FROM "shopping_carts" WHERE "user_id"='${req.user_id}'`
    );
    if (!cart.rows[0]){
      return res.status(404).json({message: "No cart found"});
    }
    return res.status(200).json({message: "Successfully fetched the carts of this user.", cart: cart.rows});
  } catch(error){
    return res.status(500).json({message: "Failed to show the carts of this user.", error});
  }
};


const deleteCart = async (req, res) => {
  if (!req.user_id){
    return res.status(404).json({message: "No authorization to delete this cart."});
  }
  const { id } = req.body;
  if (!id){
    return res.status(404).json({message: "Please identify which cart to delete"})
  }
  try{
    var cart = await client.query(
      `SELECT * FROM "shopping_carts" WHERE "id"='${id}' AND "user_id"='${req.user_id}'`
    );
    if (!cart.rows[0]){
      return res.status(404).json({message: "Cart not found"});
    }
    if (cart.rows[0].total_price >0){
      return res.status(400).json({message: "Cart is no empty you can't delete it"});
    }
    cart = await client.query(
      `DELETE FROM "shopping_carts" WHERE "id"='${id}' AND "user_id"='${req.user_id}'`
    );
    return res.status(200).json({message: "Successfully deleted the cart"});
  } catch (error){
    console.log(error)
    return res.status(500).json({message: "Failed to delete cart", error})
  }
};

export default {
  createCart,
  updateCart,
  showUserCarts,
  deleteCart,
  payment
};

