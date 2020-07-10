let express = require("express");
let router = express.Router();
let middleware = require('../api/auth/middleware');

router.get("/", middleware, async function (req, res, next) {
    console.log('Cookies: ', req.cookies)
    res.render("orders", {
        title: "MyBabytransfer",
    });
});
router.get("/new_order", middleware, async function (req, res, next) {
    res.render("new_order", {
        title: "MyBabytransfer",
    });
});



module.exports = router;