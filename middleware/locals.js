module.exports = (request, response, next) => {
    response.locals.csrfToken = request.csrfToken();
    response.locals.isAuthenticated = request.session.isAuthenticated;
    if (request.session.user) {
        response.locals.role = request.session.user.role;
    }
    next();
}