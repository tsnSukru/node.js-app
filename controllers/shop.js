const { response } = require('express');
const Product = require('../models/product/product');
const Category = require('../models/category/category');
const mongoose = require('mongoose');

exports.getIndex = async (request, response, next) => {
    //Kısaltılmış ve daha düzenli bir kod
    Promise.all([Product.find(), Category.find()])
        .then(([products, categories]) => {
            response.render('shop/index', {
                title: 'Anasayfa',
                products,
                categories,
                action: request.query.action
            });
        })
        .catch((err) => {
            console.log(err);
        });

}

exports.getProductsByCategory = (request, response, next) => {
    const categoryId = request.params.categoryid;
    // params kısmındaki saçma sapan bilgiler hata verdirmesin diye kontrol ettik
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return response.status(400).json({ error: 'Geçersiz kategori kimliği' });
    }
    Promise.all([Product.find({ category: categoryId }), Category.find()])
        .then(([products, categories]) => {
            response.render('shop/products', {
                //title: category.name,
                products: products,
                categories: categories
            });
        }).catch((err) => {
            console.log(err);
        });
}

exports.getProductDetails = (request, response, next) => {
    const productId = request.params.productid;
    // params kısmındaki saçma sapan bilgiler hata verdirmesin diye kontrol ettik
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return response.status(400).json({ error: 'Geçersiz ürün kimliği' });
    }
    Promise.all([Product.findById(productId), Category.find()])
        .then(([product, categories]) => {
            response.render('shop/productDetail', {
                title: 'Ürün Detayları',
                product: product,
                categories: categories
            });
        }).catch((err) => {
            console.log(err);
        });
}