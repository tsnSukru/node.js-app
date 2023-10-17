const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const isAuthenticated = require('../middleware/authentication');
const authorization = require('../middleware/authorization.js');
const locals = require('../middleware/locals');

router.get('/get-user-order', locals, isAuthenticated, orderController.getOrderByUser);

router.get('/get-sales', isAuthenticated, locals, authorization, orderController.getOrderBySeller);

router.post('/create-order', isAuthenticated, orderController.postCreateOrder);

router.get('/creat-multiple-order', isAuthenticated, locals, orderController.getCreateMultipleOrder);

module.exports = router;