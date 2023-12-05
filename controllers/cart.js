import Cart from "../models/cart.js";

const createCart = async (userId) => {
  try {
    const cart = await Cart.create({ totalPrice:0, userId: userId});
    return cart

  }catch (error){
    return false
  }
};

// To updated to change it
const updateCart = async (id, totalPrice) => {
  if (!id){
    return false
  }
  try{
    const cart = await Cart.findAll({where: {userId: req.userId}});
    if (totalPrice){
      cart.totalPrice = totalPrice;
    } if(payment){
      cart.payment = payment;
    }
    cart.save();
  } catch (error){
    return res.status(500).json({messgae: "Faild to update cart", error: error})
  }
};

// endpoint for payment confirmation
// const paymentConfirm = async()

const showUserCarts = async (req, res) => {
  if (!req.userId){
    return res.status(404).json({message: "No authorization to show the carts of this user."});
  }
  try{
    const cart = await Cart.findAll({where: {userId: req.userId}});
    return res.status(200).json({message: "Successfully fetched the carts of this user.", cart});
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
    const cart = await Cart.destroy({where: {id: id, userId: req.userId}});
    if (!cart){
      return res.status(404).json({message: "Cart not found"});
    }
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
};

