const mongoose = require('mongoose');
const Order = require('../models/order/order');
const Cart = require('../models/cart/cart');
const User = require('../models/user/user');
const Category = require('../models/category/category');
const Product = require('../models/product/product');

exports.getOrderByUser = (request, response, next) => {
    Promise.all([Order.find({ user: request.user.id }).populate('items').exec(), Category.find()])
        .then(([orders, categories]) => {
            response.render('shop/order', {
                title: 'Siparişler',
                categories: categories,
                orders: orders
            });
        }).catch((err) => {
            console.log(err);
        });
}

exports.getOrderBySeller = (request, response, next) => {
    Promise.all([Order.find({ 'items.product.user': request.user.id }), Category.find()])
        .then(([orders, categories]) => {
            response.render('admin/sales', {
                title: 'Satışlar',
                categories: categories,
                orders: orders
            });
        }).catch((err) => {
            console.log(err);
        });
}

exports.postCreateOrder = (request, response, next) => {
    Product.find({ _id: request.body.productId })
        .then((product) => {
            //Ürün veri tabanında varsa sipariş ekle
            if (product) {
                //siparişi oluştur
                const order = new Order({
                    items: [{
                        product: {
                            name: product[0].name,
                            price: product[0].price,
                            description: product[0].description,
                            imageUrl: product[0].imageUrl,
                            user: product[0].user,
                            category: product[0].category
                        },
                        quantity: request.body.quantity

                    }],
                    user: request.user.id
                });
                //siparişi kaydet
                order.save()
                    .then((result) => {
                        response.redirect('/');
                    }).catch((err) => {
                        console.log(err);
                    });
                //sepeti güncelle
                Cart.findOneAndUpdate({ user: request.user._id }, { $pull: { items: { product: request.body.productId } } })
                    .then((result) => {

                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
            else {
                console.log('Product not found');
            }
        }).catch((err) => {
            console.log(err);
        });
}

exports.getCreateMultipleOrder = (request, response, next) => {
    Cart.find({ user: request.user._id }).populate('items').populate('items.product').exec()
        .then((cart) => {
            //sepet boşmu kontrol et
            if (cart[0].items.length > 0) {
                //sipariş oluştur
                const order = new Order({
                    items: cart[0].items,
                    user: request.user._id
                });
                //siparişi kaydet
                order.save()
                    .then((result) => {

                    }).catch((err) => {
                        console.log(err);
                    });
                //sipariş edilen ürünleri kaldır
                Cart.updateMany({ user: request.user._id }, { $pull: { items: {} } })
                    .then((result) => {

                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
            else {
                console.log('Cart is empty');
            }
            response.redirect('/');
        }).catch((err) => {
            console.log(err);
        });
}