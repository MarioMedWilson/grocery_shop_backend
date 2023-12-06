import Router from 'express';
import { authSeller } from '../middlewares/authSeller.js';
import seller from '../controllers/seller.js'
import product from '../controllers/product.js';

const sellerRouter = Router();

sellerRouter.get('/test', (req, res)=>{
  res.send("testing seller route")
})

// Seller Auth routes
sellerRouter.post('/signup', seller.signUp);
sellerRouter.post('/login', seller.logIn);
sellerRouter.get('/verify/:code', seller.verifEmail);
sellerRouter.get('/resend-verify', seller.resendVerifiy);
sellerRouter.put('/update-seller', authSeller, seller.updateSeller);
sellerRouter.delete('/delete-seller', authSeller, seller.deleteSeller);


// Product routes
sellerRouter.post('/add-product', authSeller, product.addNewProduct);
sellerRouter.delete('/delete-product', authSeller, product.deleteProduct);
sellerRouter.put('/update-product', authSeller, product.updateProduct);
sellerRouter.get('/show-seller-products', authSeller, product.showProductsSeller);

export default sellerRouter;
