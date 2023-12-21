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
userRouter.post('/products', authUser, product.addNewProduct);
userRouter.delete('/products', authUser, product.deleteProduct);
userRouter.put('/products', authUser, product.updateProduct);
userRouter.get('/user/products', authUser, product.showProductsSeller);

// Cart
userRouter.get('/carts', authUser, cart.showUserCarts);
userRouter.delete('/carts', authUser, cart.deleteCart);
userRouter.post('/payments', authUser, cart.payment);

// Items in Cart
userRouter.post('/items', authUser, cartItems.addItem);
userRouter.get('/items', authUser, cartItems.showItemsInCart);
userRouter.put('/items', authUser, cartItems.updateItem);
userRouter.delete('/items', authUser, cartItems.removeItem);

export default userRouter;
