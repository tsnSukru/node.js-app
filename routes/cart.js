const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');
const isAuthenticated = require('../middleware/authentication');
const locals = require('../middleware/locals.js');

router.get('/get-cart', isAuthenticated, locals, cartController.getCartItems);

router.get('/add-cart/:productId', isAuthenticated, locals, cartController.getAddCart);

router.post('/delete-item', isAuthenticated, cartController.postDeleteItem);

module.exports = router;