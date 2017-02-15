/* GET home page. */
module.exports.index = function(req, res, next) {
    res.render('login', { title: 'Express' });
};