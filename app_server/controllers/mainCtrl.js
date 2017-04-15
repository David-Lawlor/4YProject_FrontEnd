module.exports.index = function(req, res) {
    res.render('index', {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        id: req.user.id
    });
};