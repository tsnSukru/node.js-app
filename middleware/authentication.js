module.exports = (request, response, next) => {
    if (!request.session.isAuthenticated) {
        //giriş yaptıktan sonra geldiği sayfaya yollamak için
        request.session.redirectTo = request.url;
        return response.redirect('/account/login');
    }
    next();
};