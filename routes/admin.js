const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.js');
const isAuthenticated = require('../middleware/authentication');
const locals = require('../middleware/locals.js');
const authorization = require('../middleware/authorization.js');

router.get('/add-product', isAuthenticated, locals, authorization, adminController.getAddProduct);

router.post('/add-product', isAuthenticated, locals, authorization, adminController.postAddProduct);

router.get('/edit-product/:productid', isAuthenticated, locals, authorization, adminController.getEditProduct);

router.post('/edit-product', isAuthenticated, authorization, adminController.postEditProduct);

router.post('/delete-product', isAuthenticated, authorization, adminController.postDeleteProduct);

router.get('/product-list', isAuthenticated, locals, authorization, adminController.getProducts);

module.exports = router;