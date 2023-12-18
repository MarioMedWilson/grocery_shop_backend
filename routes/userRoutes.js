import Router from 'express';
import user from "../controllers/user.js";
import product from '../controllers/product.js';
import cart from '../controllers/cart.js';
import cartItems from '../controllers/cartItems.js';

import { authUser } from '../middlewares/authUser.js';

const userRouter = Router();

userRouter.get('/test', (req, res)=>{
  res.send("testing user route")
})

// User
userRouter.post('/signup', user.signUp);
userRouter.post('/login', user.logIn);
userRouter.get('/verify/:code', user.receviedVerifyEmail);
userRouter.get('/resend/verify', user.resendVerifiyEmail);
userRouter.put('/user', authUser, user.updateUser);
userRouter.delete('/user', authUser, user.deleteUser);


// Product
userRouter.post('/product', authUser, product.addNewProduct);
userRouter.delete('/product', authUser, product.deleteProduct);
userRouter.put('/product', authUser, product.updateProduct);
userRouter.get('/user/products', authUser, product.showProductsSeller);

// Cart
userRouter.get('/carts', authUser, cart.showUserCarts);
userRouter.delete('/cart', authUser, cart.deleteCart);
userRouter.put('/payment', authUser, cart.payment);

// Items in Cart
userRouter.post('/item', authUser, cartItems.addItem);
userRouter.get('/items', authUser, cartItems.showItemsInCart);
userRouter.put('/item', authUser, cartItems.updateItem);
userRouter.delete('/item', authUser, cartItems.removeItem);

export default userRouter;
