let express = require("express");
let router = express.Router();
let middleware = require("../api/auth/middleware");
let user = require("../api/users");

router.get("/profile/", middleware, async function (req, res, next) {
    let user_ = await user.query.getUserById(req.user.userId);
    let user_l = user_[0];
    if (user_[0].role_id == 3) {
        res.redirect('/driver/profile');
    } else {
        res.render("customer_profile", {
            title: "MyBabytransfer",
            user_l
        });
    }

});

router.post("/profile/", middleware, async function (req, res, next) {
    console.log(req.body);
});

module.exports = router;