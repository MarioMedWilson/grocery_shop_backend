
import client from "../database/connection.js";
import Cart from "./cart.js";


const addItem = async (req, res) => {
  const { product_id, quantity} = req.body;
  if(!product_id){
    return res.status(404).json({message: "Please identify which product to add to cart"});
  } if (!quantity){
    return res.status(404).json({message: "Please identify the quantity of product you want to add"});
  }
  // Check if the cart is already paid (Create new cart and reset the id)
  // Is the quantity is in stock or not.
  // item added normally caculate the total price and add it in cart total_price.
  try{
    var cart  = await Cart.createCart(req.user_id);
    if (!cart.rows[0]){
      return res.status(500).json({message: "Failed to create cart"});
    }
    var product = await client.query(
      `SELECT * FROM "products" WHERE "id"='${product_id}'`
    );
    if (!product.rows[0]){
      return res.status(404).json({message: "No product found"});
    } if (product.rows[0].quantity_in_stock < quantity){
      return res.status(400).json({message: `There is no available quantity that you asked for the available is ${product.rows[0].quantity_in_stock}`})
    }
    var cartItem = await client.query(
      `SELECT * FROM "shopping_cart_items" WHERE "product_id"='${product_id}' AND "shopping_cart_id"='${cart.rows[0].id}'`
    );
    if (cartItem.rows[0]){
      return res.status(400).json({message: "This item is already in cart."});
    }
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatedAt = createdAt;
    cartItem = await client.query(
      `INSERT INTO "shopping_cart_items" (
        "quantity", 
        "product_id", 
        "shopping_cart_id",
        "createdAt",
        "updatedAt") VALUES (
          '${quantity}', 
          '${product_id}', 
          '${cart.rows[0].id}',
          '${createdAt}',
          '${updatedAt}') RETURNING *`
    );
    if (!cartItem.rows[0]){
      return res.status(500).json({message: "Failed to add the item to cart."});
    }
    const total_price = cart.rows[0].total_price + quantity*product.rows[0].price;
    const updateCart = await Cart.updateCart(cart.rows[0].id, total_price);

    const updateProduct = await client.query(
      `UPDATE "products" SET "quantity_in_stock"='${product.rows[0].quantity_in_stock - quantity}' WHERE "id"='${product_id}' RETURNING *`
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
  var cart = await Cart.createCart(req.user_id);
  const { product_id, quantity } = req.body;
  if (!product_id){
    return res.status(404).json({message: "Please declare the product."})
  }
  try{
    var cartItem = await client.query(
      `SELECT * FROM "shopping_cart_items" WHERE "product_id"='${product_id}' AND "shopping_cart_id"='${cart.rows[0].id}'`
    );
    if (!cartItem.rows[0]){
      return res.status(404).json({message: "No items in cart."});
    }
    // That case to decrease the quantity in cart (handle to return the quantity of product and cart)
    var product = await client.query(
      `SELECT * FROM "products" WHERE "id"='${product_id}'`
    );

    // if the quantity in cart less that the quantity that user want to update
    // so return the quantity in cart to product table and update the cart item 
    // and update the total price in cart table
    if (cartItem.rows[0].quantity > quantity){
      const diff = cartItem.rows[0].quantity - quantity;
      const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

      // update product table
      const quantity_in_stock = product.rows[0].quantity_in_stock + diff;
      const updateProduct = await client.query(
        `UPDATE "products" SET "quantity_in_stock"='${quantity_in_stock}', "updatedAt"='${updatedAt}' WHERE "id"='${product_id}' RETURNING *`
      );

      //update cart item
      cartItem = await client.query(
        `UPDATE "shopping_cart_items" SET "quantity"='${quantity}', "updatedAt"='${updatedAt}' WHERE "product_id"='${product_id}' AND "shopping_cart_id"='${cart.rows[0].id}' RETURNING *`
      );

      // update total price in cart table
      const total_price = cart.rows[0].total_price - (diff * product.rows[0].price);
      const updateCart = await Cart.updateCart(cart.rows[0].id, total_price);
      return res.status(200).json({message: "Updated successfully.", cartItem: cartItem.rows[0]});
    }
    // That case to increase the quantity in cart (handle to return the quantity of product and cart)
    // if the quantity in cart greater that the quantity that user want to update
    // so return the quantity in cart to product table and update the cart item
    // and update the total price in cart table
    if (cartItem.rows[0].quantity < quantity){
      const diff =  quantity - cartItem.rows[0].quantity;
      
      // check if quantity is available in product table
      if (product.rows[0].quantity_in_stock < diff){
        return res.status(400).json({message: `No quantity available, the availble is ${product.rows[0].quantity_in_stock}`});
      }
      const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      // if available then udpate the product table as quantity diff taken
      const quantity_in_stock = product.rows[0].quantity_in_stock - diff;
      const updateProduct = await client.query(
        `UPDATE "products" SET "quantity_in_stock"='${quantity_in_stock}', "updatedAt"='${updatedAt}' WHERE "id"='${product_id}' RETURNING *`
      );

      //update cart item
      cartItem = await client.query(
        `UPDATE "shopping_cart_items" SET "quantity"='${quantity}', "updatedAt"='${updatedAt}' WHERE "product_id"='${product_id}' AND "shopping_cart_id"='${cart.rows[0].id}' RETURNING *`
      );

      // update total price in cart table
      const total_price = cart.rows[0].total_price + (diff * product.rows[0].price);
      const updateCart = await Cart.updateCart(cart.rows[0].id, total_price);

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
  const cart = await Cart.createCart(req.user_id);
  try{
    var items = await client.query(
      `SELECT * FROM "shopping_cart_items" WHERE "shopping_cart_id"='${cart.rows[0].id}'`
    );
    if (!items.rows[0]){
      return res.status(404).json({message: "No items in cart."});
    }
    var product = await client.query(
      `SELECT * FROM "products" WHERE "id"='${items.rows[0].product_id}'`
    );
    var shopping_cart = await client.query(
      `SELECT * FROM "shopping_carts" WHERE "id"='${items.rows[0].shopping_cart_id}'`
    );
    var country = await client.query(
      `SELECT * FROM "brand_nationalities" WHERE "id"='${product.rows[0].brand_nationality_id}'`
    );
    items.rows[0].product = product.rows[0];
    items.rows[0].shopping_cart = shopping_cart.rows[0];
    items.rows[0].product.country = country.rows[0];
    return res.status(200).json({items: items.rows, Total_Price: cart.rows[0].total_price});
  }catch (error){
    console.log(error)
    return res.status(500).json({message: "Failed to show the items in cart.", error});
  }
};


const removeItem = async (req, res) => {
  const { product_id } = req.body;
  const cart = await Cart.createCart(req.user_id);
  try{
    const cartItem = await client.query(
      `SELECT * FROM "shopping_cart_items" WHERE "product_id"='${product_id}' AND "shopping_cart_id"='${cart.rows[0].id}'`
    );
    if (!cartItem.rows[0]){
      return res.status(404).json({message: "No items in cart."});
    }
    const product = await client.query(
      `SELECT * FROM "products" WHERE "id"='${product_id}'`
    );
    const quantity_in_stock = product.rows[0].quantity_in_stock + cartItem.rows[0].quantity;
    const updateProduct = await client.query(
      `UPDATE "products" SET "quantity_in_stock"='${quantity_in_stock}' WHERE "id"='${product_id}' RETURNING *`
    );
    if (!updateProduct.rows[0]){
      return res.status(500).json({message: "Failed to update product."});
    }
    const total_price = cart.rows[0].total_price - (cartItem.rows[0].quantity * product.rows[0].price);
    const updateCart = await Cart.updateCart(cart.rows[0].id, total_price);
    const removeItem = await client.query(
      `DELETE FROM "shopping_cart_items" WHERE "product_id"='${product_id}' AND "shopping_cart_id"='${cart.rows[0].id}'`
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


