let express = require("express");
let router = express.Router();
let middleware = require('../api/auth/middleware');

router.get("/", middleware, async function (req, res, next) {
    console.log('Cookies: ', req.cookies)
    res.render("orders", {
        title: "MyBabytransfer",
    });
});



module.exports = router;