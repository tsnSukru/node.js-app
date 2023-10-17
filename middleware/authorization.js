module.exports = (request, response, next) => {
    if (request.session.user.role !== 'seller') {
        return response.status(400).json({ error: 'Yetkisiz İşlem' });
    }
    next();
}