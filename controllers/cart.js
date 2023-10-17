const { request } = require('express');
const Cart = require('../models/cart/cart');
const Category = require('../models/category/category');
const Product = require('../models/product/product');
const { default: mongoose } = require('mongoose');

exports.getCartItems = (request, response, next) => {
    Promise.all([Category.find(), Cart.find({ user: request.user.id }).populate('items').populate('items.product').exec()])
        .then(([categories, cart]) => {
            response.render('shop/cart', {
                title: 'Alışveriş Sepeti',
                categories: categories,
                cartItems: cart[0].items
            });
        }).catch((err) => {
            console.log(err);
        });
}

exports.getAddCart = (request, response, next) => {
    if (!mongoose.Types.ObjectId.isValid(request.params.productId)) {
        return response.status(400).json({ error: 'Geçersiz ürün kimliği' });
    }

    const userId = request.user._id;
    const productId = request.params.productId;

    Cart.findOne({ user: userId })
        .then((cart) => {
            //kullanıcının sepeti var mı kontrol et
            if (cart) {
                //sepette üründen var mı kontrol et. Varsa bir artır
                const existingItem = cart.items.find(item => item.product.equals(productId));
                if (existingItem) {
                    existingItem.quantity++;
                    cart.save()
                        .then((result) => {
                            response.redirect("/cart/get-cart");
                        }).catch((err) => {
                            console.log(err);
                        });
                }
                //yoksa ekle
                else {
                    cart.items.push({ product: productId, quantity: 1 });
                    cart.save()
                        .then((result) => {
                            response.redirect("/cart/get-cart");
                        }).catch((err) => {
                            console.log(err);
                        });
                }
            }
            //yoksa oluştur
            else {
                const cart = new Cart({
                    user: userId
                });
                cart.save()
                    .then((result) => {

                    }).catch((err) => {
                        console.log(err);
                    });
            }
        }).catch((err) => {
            console.log(err);
        });
}

exports.postDeleteItem = (request, response, next) => {
    Cart.findOne({user:request.user._id}).
    then((result) => {
       const itemIndex = result.items.findIndex(item => item.product.equals(request.body.productId));
       result.items.splice(itemIndex,1);
       result.save();
       response.redirect("/cart/get-cart");
    }).catch((err) => {
         console.log(err);
    });
}