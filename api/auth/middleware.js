const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = (req, res, next) => {
    // if (req.method == 'OPTIONS') {
    //     return next();
    // }
    try {
        const token = req.cookies.token;
        console.log(req.cookies);
        if (!token) {
            res.redirect('/');
            // return res.status(401).json({
            //     message: "is not auth user"
            // })
        }
        console.log(token);
        const decoded = jwt.verify(token, config.get('secret_jwt'));
        req.user = decoded;
        next()
    } catch (e) {
        console.log(e);
        res.redirect('/');
        // return res.status(401).json({
        //     message: "is not auth user",
        //     e: e
        // });
    }
}