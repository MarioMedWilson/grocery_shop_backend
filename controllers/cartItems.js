import CartItem from "../models/cartItems.js";
import Cart from "../models/cart.js";
import cart from "./cart.js";
import Product from "../models/product.js";


const instanceCart = async (userId) => {
  var cart = await Cart.findOne({where: {userId: userId, payment: false}});
  if (!cart){
    try{
      cart = await Cart.create({ totalPrice:0, userId: userId});
    }catch (error){
      return false
    }
  }
  return cart
}

const addItem = async (req, res) => {
  const { productId, quantity} = req.body;
  if(!productId){
    return res.status(404).json({message: "Please identify which product to add to cart"});
  } if (!quantity){
    return res.status(404).json({message: "Please identify the quantity of product you want to add"});
  }
  // Check if the cart is already paid (Create new cart and reset the id)
  // Is the quantity is in stock or not.
  // item added normally caculate the total price and add it in cart totalPrice.
  try{
    var cart = await instanceCart(req.userId);
    if (!cart){
      return res.status(500).json({message: "Failed to create cart"});
    }

    var product = await Product.findByPk(productId);
    if (!product){
      return res.status(404).json({message: "No product found"});
    } if (product.quantityInStock < quantity){
      return res.status(400).json({message: `There is no available quantity that you asked for the available is ${product.quantityInStock}`})
    }

    cart.totalPrice = cart.totalPrice + quantity*product.price;
    product.quantityInStock = product.quantityInStock - quantity;
    
    var cartItem = await CartItem.findOne({where: {productId: productId, shoppingCartId: cart.id}})
    if (cartItem){
      return res.status(400).json({message: "Item is already in cart", cartItem});
    }

    cartItem = await CartItem.create({quantity: quantity, productId: productId, shoppingCartId: cart.id});
    cart.save();
    product.save();
    return res.status(200).json({message: "Sucessfully added the item", cartItem});
  } catch (error){
    console.log(error)
    return res.status(500).json({message: "Failed to add the item to cart.", error});
  }
};

const updateItem = async (req, res) => {
  var cart = await instanceCart(req.userId);
  const { productId, quantity } = req.body;
  if (!productId){
    return res.status(404).json({message: "Please declare the product."})
  }
  try{
    const cartItem = await CartItem.findOne({where: {productId: productId, shoppingCartId: cart.id}});
    if (!cartItem){
      return res.status(404).json({message: "No item in cart."});
    }
    // That case to decrease the quantity in cart (handle to return the quantity of product and cart)
    var product = await Product.findByPk(productId);
    if (cartItem.quantity > quantity){
      const diff = cartItem.quantity - quantity;


      // update product table
      product.quantityInStock = product.quantityInStock + diff;
      product.save();
      
      //update cart item
      cartItem.quantity = quantity;
      cartItem.save();
      
      // update total price in cart table
      cart.totalPrice = cart.totalPrice - (diff * product.price);
      cart.save();
    } 

    if (cartItem.quantity < quantity){
      const diff =  quantity - cartItem.quantity;
      // check if quantity is available in product table
      if (product.quantityInStock < diff){
        return res.status(400).json({message: `No quantity available, the availble is ${product.quantityInStock}`});
      }
      
      // if available then udpate the product table as quantity diff taken
      product.quantityInStock = product.quantityInStock - diff;
      product.save();

      //update cart item
      cartItem.quantity = quantity;
      cartItem.save();

      // update total price in cart table
      cart.totalPrice = cart.totalPrice + (diff * product.price);
      cart.save();
    }
    return res.status(200).json({message: "Updated successfully.", cartItem});
  } catch(error){
    console.log(error)
    return res.status(500).json({message: "Failed to update the item in cart.", error});
  }
};

const showItemsInCart = async (req, res) => {
  const cart = await instanceCart(req.userId);
  try{
    var items = await CartItem.findAll({
      where: {shoppingCartId: cart.id},
      include: Product
    });
    return res.status(200).json({message: "Successfully fetch items in cart", items, Total_Price: cart.totalPrice});
  }catch (error){
    return res.status(500).json({message: "Failed to show the items in cart.", error});
  }
};

const removeItem = async (req, res) => {
  const { productId } = req.body;
  const cart = await instanceCart(req.userId);
  try{
    const cartItem = await CartItem.findOne({where: {productId: productId, shoppingCartId: cart.id}});
    if (!cartItem){
      return res.status(404).json({message: "No item in cart."});
    }
    const product = await Product.findByPk(productId);
    product.quantityInStock = product.quantityInStock + cartItem.quantity;
    product.save();
    cart.totalPrice = cart.totalPrice - (cartItem.quantity * product.price);
    cart.save();
    cartItem.destroy();
    return res.status(200).json({message: "Successfully removed the item from cart."});
  }catch (error){
    return res.status(500).json({message: "Failed to remove the item from cart.", error});
  }
}

export default {
  addItem,
  updateItem,
  showItemsInCart,
  removeItem

};


