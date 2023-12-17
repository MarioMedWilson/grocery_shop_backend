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
userRouter.get('/resend-verify', user.resendVerifiyEmail);
userRouter.put('/update-user', authUser, user.updateUser);
userRouter.delete('/delete-user', authUser, user.deleteUser);

// Products
userRouter.get('/all-products', product.showProducts);


// Cart
userRouter.get('/show-carts', authUser, cart.showUserCarts);
userRouter.delete('/delete-cart', authUser, cart.deleteCart);
userRouter.put('/pay-cart', authUser, cart.payment);

// Items in Cart
userRouter.post('/add-item-cart', authUser, cartItems.addItem);
userRouter.get('/show-items-cart', authUser, cartItems.showItemsInCart);
userRouter.put('/update-item-cart', authUser, cartItems.updateItem);
userRouter.delete('/delete-item-cart', authUser, cartItems.removeItem);

export default userRouter;
