let express = require("express");
let router = express.Router();
let middleware = require('../api/auth/middleware');

let database = require("../database");
database.connectDatabase();



router.get("/", function (req, res, next) {
  res.render("index", {
    title: "MyBabytransfer",
  });
});



module.exports = router;