let express = require("express");
let router = express.Router();
let middleware = require("../api/auth/middleware");

router.get("/profile/", middleware, function (req, res, next) {
    res.render("customer_profile", {
        title: "MyBabytransfer",
    });
});

module.exports = router;