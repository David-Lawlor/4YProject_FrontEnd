module.exports.index = function(req, res, next) {
    res.render('index', {
        username: req.user.username
    });
};