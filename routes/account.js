const express = require('express');
const routes = express.Router();
const accountController = require('../controllers/account');
const locals = require('../middleware/locals');

routes.get('/login', locals, accountController.getLogin);
routes.post('/login', accountController.postLogin);

routes.get('/register', locals, accountController.getRegister);
routes.post('/register', accountController.postRegister);

routes.get('/logout', locals, accountController.getLogout);

routes.get('/reset-password', locals, accountController.getResetPassword);
routes.post('/reset-password', accountController.postResetPassword);

module.exports = routes;