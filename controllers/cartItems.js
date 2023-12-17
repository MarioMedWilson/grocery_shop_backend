
import client from "../database/connection.js";
import Cart from "./cart.js";


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
    var cart  = await Cart.createCart(req.userId);
    if (!cart.rows[0]){
      return res.status(500).json({message: "Failed to create cart"});
    }
    var product = await client.query(
      `SELECT * FROM "products" WHERE "id"='${productId}'`
    );
    if (!product.rows[0]){
      return res.status(404).json({message: "No product found"});
    } if (product.rows[0].quantityInStock < quantity){
      return res.status(400).json({message: `There is no available quantity that you asked for the available is ${product.rows[0].quantityInStock}`})
    }
    var cartItem = await client.query(
      `SELECT * FROM "shopping_cart_items" WHERE "productId"='${productId}' AND "shoppingCartId"='${cart.rows[0].id}'`
    );
    if (cartItem.rows[0]){
      return res.status(400).json({message: "This item is already in cart."});
    }
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatedAt = createdAt;
    cartItem = await client.query(
      `INSERT INTO "shopping_cart_items" (
        "quantity", 
        "productId", 
        "shoppingCartId",
        "createdAt",
        "updatedAt") VALUES (
          '${quantity}', 
          '${productId}', 
          '${cart.rows[0].id}',
          '${createdAt}',
          '${updatedAt}') RETURNING *`
    );
    if (!cartItem.rows[0]){
      return res.status(500).json({message: "Failed to add the item to cart."});
    }
    const totalPrice = cart.rows[0].totalPrice + quantity*product.rows[0].price;
    const updateCart = await Cart.updateCart(cart.rows[0].id, totalPrice);

    const updateProduct = await client.query(
      `UPDATE "products" SET "quantityInStock"='${product.rows[0].quantityInStock - quantity}' WHERE "id"='${productId}' RETURNING *`
    );
    if (!updateProduct.rows[0]){
      return res.status(500).json({message: "Failed to update product."});
    }
    return res.status(200).json({message: "Sucessfully added the item", cartItem: cartItem.rows[0]});
  } catch (error){
    console.log(error)
    return res.status(500).json({message: "Failed to create cart", error});
  }
};

const updateItem = async (req, res) => {
  var cart = await Cart.createCart(req.userId);
  const { productId, quantity } = req.body;
  if (!productId){
    return res.status(404).json({message: "Please declare the product."})
  }
  try{
    var cartItem = await client.query(
      `SELECT * FROM "shopping_cart_items" WHERE "productId"='${productId}' AND "shoppingCartId"='${cart.rows[0].id}'`
    );
    if (!cartItem.rows[0]){
      return res.status(404).json({message: "No items in cart."});
    }
    // That case to decrease the quantity in cart (handle to return the quantity of product and cart)
    var product = await client.query(
      `SELECT * FROM "products" WHERE "id"='${productId}'`
    );

    // if the quantity in cart less that the quantity that user want to update
    // so return the quantity in cart to product table and update the cart item 
    // and update the total price in cart table
    if (cartItem.rows[0].quantity > quantity){
      const diff = cartItem.rows[0].quantity - quantity;
      const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

      // update product table
      const quantityInStock = product.rows[0].quantityInStock + diff;
      const updateProduct = await client.query(
        `UPDATE "products" SET "quantityInStock"='${quantityInStock}', "updatedAt"='${updatedAt}' WHERE "id"='${productId}' RETURNING *`
      );

      //update cart item
      cartItem = await client.query(
        `UPDATE "shopping_cart_items" SET "quantity"='${quantity}', "updatedAt"='${updatedAt}' WHERE "productId"='${productId}' AND "shoppingCartId"='${cart.rows[0].id}' RETURNING *`
      );

      // update total price in cart table
      const totalPrice = cart.rows[0].totalPrice - (diff * product.rows[0].price);
      const updateCart = await Cart.updateCart(cart.rows[0].id, totalPrice);
      return res.status(200).json({message: "Updated successfully.", cartItem: cartItem.rows[0]});
    }
    // That case to increase the quantity in cart (handle to return the quantity of product and cart)
    // if the quantity in cart greater that the quantity that user want to update
    // so return the quantity in cart to product table and update the cart item
    // and update the total price in cart table
    if (cartItem.rows[0].quantity < quantity){
      const diff =  quantity - cartItem.rows[0].quantity;
      
      // check if quantity is available in product table
      if (product.rows[0].quantityInStock < diff){
        return res.status(400).json({message: `No quantity available, the availble is ${product.rows[0].quantityInStock}`});
      }
      const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      // if available then udpate the product table as quantity diff taken
      const quantityInStock = product.rows[0].quantityInStock - diff;
      const updateProduct = await client.query(
        `UPDATE "products" SET "quantityInStock"='${quantityInStock}', "updatedAt"='${updatedAt}' WHERE "id"='${productId}' RETURNING *`
      );

      //update cart item
      cartItem = await client.query(
        `UPDATE "shopping_cart_items" SET "quantity"='${quantity}', "updatedAt"='${updatedAt}' WHERE "productId"='${productId}' AND "shoppingCartId"='${cart.rows[0].id}' RETURNING *`
      );

      // update total price in cart table
      const totalPrice = cart.rows[0].totalPrice + (diff * product.rows[0].price);
      const updateCart = await Cart.updateCart(cart.rows[0].id, totalPrice);

      return res.status(200).json({message: "Updated successfully.", cartItem: cartItem.rows[0]});
    } else {
      return res.status(400).json({message: "No change in quantity."});
    }
  } catch(error){
    console.log(error)
    return res.status(500).json({message: "Failed to update the item in cart.", error});
  }
};

const showItemsInCart = async (req, res) => {
  const cart = await Cart.createCart(req.userId);
  try{
    var items = await client.query(
      `SELECT * FROM "shopping_cart_items" WHERE "shoppingCartId"='${cart.rows[0].id}'`
    );
    if (!items.rows[0]){
      return res.status(404).json({message: "No items in cart."});
    }
    return res.status(200).json({message: "Successfully fetch items in cart", items: items.rows, Total_Price: cart.rows[0].totalPrice});
  }catch (error){
    console.log(error)
    return res.status(500).json({message: "Failed to show the items in cart.", error});
  }
};


const removeItem = async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.createCart(req.userId);
  try{
    const cartItem = await client.query(
      `SELECT * FROM "shopping_cart_items" WHERE "productId"='${productId}' AND "shoppingCartId"='${cart.rows[0].id}'`
    );
    if (!cartItem.rows[0]){
      return res.status(404).json({message: "No items in cart."});
    }
    const product = await client.query(
      `SELECT * FROM "products" WHERE "id"='${productId}'`
    );
    const quantityInStock = product.rows[0].quantityInStock + cartItem.rows[0].quantity;
    const updateProduct = await client.query(
      `UPDATE "products" SET "quantityInStock"='${quantityInStock}' WHERE "id"='${productId}' RETURNING *`
    );
    if (!updateProduct.rows[0]){
      return res.status(500).json({message: "Failed to update product."});
    }
    const totalPrice = cart.rows[0].totalPrice - (cartItem.rows[0].quantity * product.rows[0].price);
    const updateCart = await Cart.updateCart(cart.rows[0].id, totalPrice);
    const removeItem = await client.query(
      `DELETE FROM "shopping_cart_items" WHERE "productId"='${productId}' AND "shoppingCartId"='${cart.rows[0].id}'`
    );
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


