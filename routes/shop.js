const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.js');
const isAuthenticated = require('../middleware/authentication');
const csrf = require('../middleware/locals.js');
const locals = require('../middleware/locals.js');

router.get('/', locals, shopController.getIndex);

router.get('/details/:productid', locals, shopController.getProductDetails);

router.get('/category/:categoryid', locals, shopController.getProductsByCategory);

module.exports = router;