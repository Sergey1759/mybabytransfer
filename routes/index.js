let express = require("express");
let router = express.Router();

let database = require("../database");
let api = require("../api/users");
let mailer = require("../service/mailer");
let randomstring = require("randomstring");
database.connectDatabase();

let random = {};
let host;

router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Express",
  });
});

router.get("/reset_password", function (req, res, next) {
  res.render("reset_password", {
    title: "Express",
  });
});

router.post("/sign", async function (req, res, next) {
  let rand = randomstring.generate(15);
  host = req.get("host");
  let link = "http://" + req.get("host") + "/verify?id=" + rand + "&user_mail=" + req.body.user_email;
  let html = `<a href=${link}>google</a>`;
  random[rand] = true;
  
  try {
    await api.query.insert(req.body.user_password, req.body.user_email, req.body.user_phone, 2);
    mailer(req.body.user_email, "sadasdasd", "ashgdhasdg", html);
  } catch (e) {
    console.log(e);
  }
  
});

router.get("/verify", function (req, res) {
  console.log(req.protocol + ":/" + req.get("host"));
  if (req.protocol + "://" + req.get("host") == "http://" + host) {
    console.log("Domain is matched. Information is from Authentic email");
    if (random[req.query.id]) {
      //email is verified
      delete random[req.query.id];
      console.log(req.query); //user_mail
      
    } else {
      console.log("email is not verified");
    }
  } else {
    console.log("Request is from unknown source");
  }
  res.redirect("/");
});

module.exports = router;