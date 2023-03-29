const admit = require("../firebase");

exports.authCheck = (req, res, next) => {
    console.log(req.headers);
    next();
};