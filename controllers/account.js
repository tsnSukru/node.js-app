const mongoose = require('mongoose');
const User = require('../models/user/user');
const Cart = require('../models/cart/cart');
const bcrypt = require('bcrypt');

exports.getLogin = (request, response, next) => {
    const errorMessage = request.session.errorMessage;
    delete request.session.errorMessage;
    response.render('account/login', {
        title: 'Login',
        errorMessage: errorMessage
    });
}
exports.postLogin = (request, response, next) => {
    //kullanıcı var mı?
    User.findOne({ email: request.body.email })
        .then((user) => {
            if (!user) {
                request.session.errorMessage = 'Bu mail adresi ile kayıtlı bir hesap bulunamamıştır';
                request.session.save(function (err) {
                    console.log(err);
                    response.redirect('/account/login');
                });
            }
            const result = bcrypt.compareSync(request.body.password, user.password);
            if (result) {
                request.session.user = user;
                request.session.role = user.role;
                request.session.isAuthenticated = true;
                return request.session.save(function (err) {
                    console.log(err);
                    //geldiği url'yi aldık, eğer boşsa anasayfayı atadık
                    var url = request.session.redirectTo || '/';
                    //request.session.redirectTo değişkenini sildik
                    delete request.session.redirectTo;
                    response.redirect(url);
                });
            }
            response.redirect('/account/login');
        }).catch((err) => {
            console.log(err);
        });
}

exports.getRegister = (request, response, next) => {
    response.render('account/register', {
        title: 'register'
    });
}
exports.postRegister = (request, response, next) => {
    User.findOne({ 'email': request.body.email })
        .then((result) => {
            if (result) {
                response.redirect('/account/register');
            }
            const password = bcrypt.hashSync(request.body.password, 10);
            const user = new User({
                name: request.body.name,
                email: request.body.email,
                password: password
            });
            return user.save();
        })
        .then((result) => {
            const cart = new Cart({
                user: result._id
            });
            return cart.save();
        })
        .then((result) => {
            response.redirect('/account/login');
        }).catch((err) => {
            console.log(err.message);
        });
}

exports.getLogout = (request, response, next) => {
    request.session.destroy(err => {
        console.log(err);
        response.redirect('/');
    });
};

exports.getResetPassword = (request, response, next) => {
    response.render('account/resetPassword', {
        title: 'Register'
    });
}
exports.postResetPassword = (request, response, next) => {

}