const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const mongoDbStore = require('connect-mongodb-session')(session);
const User = require('./models/user/user');
const errorController = require('./controllers/error');
const connectionString = 'mongodb://127.0.0.1:27017/nodejs_app';
const csurf = require('csurf');
const multer = require('multer');


var store = new mongoDbStore({
    uri: connectionString,
    collection: 'mySession'
});
store.on('error', function (error) {
    console.log(error);
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
})

//gelen url kodlarını, form verilerini çözümler
app.use(bodyParser.urlencoded({ extended: false }));
//form üzerinden dosyada gönderebilmek için
app.use(multer({ storage: storage }).single("imageUrl"));
app.use(cookieParser());
app.use(session({
    //şifreleme için istediğin bir string
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000
    },
    store: store
}));

app.use((request, response, next) => {
    if (!request.session.user) {
        return next();
    }
    User.findById(request.session.user._id)
        .then((result) => {
            request.user = result;
            next();
        }).catch((err) => {
            console.log(err);
        });
});

app.use(csurf());

//view engine olarak ne kullanacağımız
app.set('view engine', 'pug');
//view klasörü konumumuz
app.set('views', './views')
//public klasörünü belirtme
app.use(express.static(path.join(__dirname, 'public')));

const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/order');
const shopRoutes = require('./routes/shop');
const cartRoutes = require('./routes/cart');
const accountRoutes = require('./routes/account');
const { callbackify } = require('util');

app.use('/', shopRoutes);
app.use('/admin', adminRoutes);
app.use('/order', orderRoutes);
app.use('/cart', cartRoutes);
app.use('/account', accountRoutes);
app.use(errorController.get404Page);

mongoose.connect(connectionString)
    .then((result) => {
        console.log("------- Connection Succes -------");
    }).catch((err) => {
        console.log(err);
    });

app.listen(3000);