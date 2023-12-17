// import Cart from "../models/cart.js";
import client from "../database/connection.js";


const createCart = async (userId) => {
  try {
    var cart = await client.query(
      `SELECT * FROM "shopping_carts" WHERE "userId"='${userId}' AND "payment"='${false}'`
    );
    if (!cart.rows[0]){
      const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const updatedAt = createdAt;
      cart = await client.query(
        `INSERT INTO "shopping_carts" ("totalPrice", "userId", "createdAt", "updatedAt") VALUES (
          '${0}', 
          '${userId}',
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

const updateCart = async (id, totalPrice) => {
  if (!id){
    return false
  }
  try{
    const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const cart = await client.query(
      `UPDATE "shopping_carts" SET "totalPrice"='${totalPrice}', "updatedAt"='${updatedAt}' WHERE "id"='${id}' RETURNING *`
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
  if (!req.userId){
    return res.status(404).json({message: "No authorization to pay this cart."});
  }
  const { id } = req.body;
  if (!id){
    return res.status(404).json({message: "Please identify which cart to pay"})
  }
  try{
    // const cart = await Cart.findOne({where: {id: id, userId: req.userId}});
    const cart = await client.query(
      `SELECT * FROM "shopping_carts" WHERE "id"='${id}' AND "userId"='${req.userId}'`
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
  if (!req.userId){
    return res.status(404).json({message: "No authorization to show the carts of this user."});
  }
  try{
    const cart = await client.query(
      `SELECT * FROM "shopping_carts" WHERE "userId"='${req.userId}'`
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
  if (!req.userId){
    return res.status(404).json({message: "No authorization to delete this cart."});
  }
  const { id } = req.body;
  if (!id){
    return res.status(404).json({message: "Please identify which cart to delete"})
  }
  try{
    var cart = await client.query(
      `SELECT * FROM "shopping_carts" WHERE "id"='${id}' AND "userId"='${req.userId}'`
    );
    if (!cart.rows[0]){
      return res.status(404).json({message: "Cart not found"});
    }
    if (cart.rows[0].totalPrice >0){
      return res.status(400).json({message: "Cart is no empty you can't delete it"});
    }
    cart = await client.query(
      `DELETE FROM "shopping_carts" WHERE "id"='${id}' AND "userId"='${req.userId}'`
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

