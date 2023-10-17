exports.get404Page = (request, response, next) => {
    response.status(404).render('./errors/404', { title: 'Page Not Found' });
}