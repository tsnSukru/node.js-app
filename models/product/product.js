const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'ürün ismi girmelisiniz'],
        minLength: [5,'Ürün ismi en az 5 karakter olmalı'],
        maxlength: 255
    },
    price: {
        type: Number,
        //ürün aktifse gerekli olsun
        required: function () {
            return this.isActive;
        }
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    tag: [String],
    isActive: {
        type: Boolean
    }
});

module.exports = mongoose.model('Product', productSchema);