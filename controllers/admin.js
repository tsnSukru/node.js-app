const mongoose = require('mongoose');
const Category = require('../models/category/category');
const Product = require('../models/product/product');
const fs = require('node:fs')

exports.getProducts = (request, response, next) => {
    //Kısaltılmış ve daha düzenli bir kod
    Promise.all([Product.find({ user: request.user._id }), Category.find()])
        .then(([products, categories]) => {
            response.render('admin/products', {
                title: 'Admin Listesi',
                products,
                categories,
                action: request.query.action
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getAddProduct = (request, response, next) => {
    Category.find()
        .then((result) => {
            response.render('admin/addProduct',
                {
                    title: 'yeni ürün ekle',
                    categories: result
                });
        }).catch((err) => {
            console.log(err);
        });
}

exports.postAddProduct = (request, response, next) => {
    const product = new Product({
        name: request.body.name,
        price: request.body.price,
        imageUrl: request.file.filename,
        description: request.body.description,
        user: request.user._id,
        category: request.body.categoryId
    });
    product.save()
        .then(() => {
            response.redirect("/admin/product-list");
        }).catch((err) => {
            console.log(err.errors);
            let message = '';
            //hataları doldur
            if (err.name === 'ValidationError') {
                for (let field in err.errors) {
                    message += err.errors[field].message + '</br>';
                }
                //hata varsa sayfayı yeniden yükle
                Category.find()
                    .then((result) => {
                        response.status(500).render('admin/addProduct',
                            {
                                title: 'Yeni Ürün Ekle',
                                categories: result,
                                errorMessage: message
                            });
                    }).catch((err) => {
                        console.log(err);
                    });
            }
            else {
                //beklenmedik hata varsa sayfayı yeniden yükle
                Category.find()
                    .then((result) => {
                        response.render('admin/addProduct',
                            {
                                title: 'Yeni Ürün Ekle',
                                categories: result,
                                errorMessage: 'Beklenmedik bir hata oluştu. Lütfen daha sonra yeniden deneyiniz...'
                            });
                    }).catch((err) => {
                        console.log(err);
                    });
            }
        });
}

//get metodunda bilgiler params kısmında
exports.getEditProduct = (request, response, next) => {
    const productId = request.params.productid;
    // params kısmındaki saçma sapan bilgiler hata verdirmesin diye kontrol ettik
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return response.status(400).json({ error: 'Geçersiz kategori kimliği' });
    }
    Promise.all([Category.find(), Product.findOne({ '_id': productId, 'user': request.user._id })])
        .then(([categories, product]) => {
            response.render('admin/editProduct', {
                title: 'Ürünü düzenle',
                product: product,
                categories: categories
            });
        }).catch((err) => {
            console.log(err);
        });
}

//post metodunda bilgiler body kısmında
exports.postEditProduct = (request, response, next) => {
    Product.findById(request.body.id).
        then((result) => {
            //ürün resmi güncellenmiş mi?
            if (request.file) {
                fs.unlink('./public/img/' + result.imageUrl, (err) => {
                    if (err) throw err;
                });
                result.imageUrl = request.file.filename;
            }
            result.name = request.body.name;
            result.description = request.body.description;
            result.price = request.body.price;
            result.category = request.body.categoryId;
            //return sayesinde iç içe thenc kullanmadık sonraki then'e aktardık
            return result.save();
        }).then((result) => {
            response.redirect('/admin/product-list?action=update');
        }).catch((err) => {
            console.log(err);
        });
}

exports.postDeleteProduct = (request, response, next) => {
    Product.findOneAndDelete({ '_id': request.body.productid, 'user': request.user._id })
        .then((result) => {
            fs.unlink('./public/img/' + result.imageUrl, (err) => {
                if (err) throw err;
            });
            response.redirect("/admin/product-list?action=delete");
        }).catch((err) => {
            console.log(err);
            response.redirect("/admin/product-list?action=delete_unsucces");
        });
}