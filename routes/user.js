let express = require("express");
let router = express.Router();

let api = require("../api/users");
let customer = require("../api/customer");
let mailer = require("../service/mailer");
let randomstring = require("randomstring");
let crypto = require("crypto-js");
let config = require('config');

let JWT = require('../api/auth/token');
let random = {};
let host;

router.get("/reset_password", function (req, res, next) {
    res.render("reset_password", {
        title: "Express",
    });
});

router.post("/sign", async function (req, res, next) {
    let rand = randomstring.generate(15);
    host = req.get("host");
    // prettier-ignore
    let link = "http://" + req.get("host") + "/users/verify?id=" + rand + "&user_mail=" + req.body.user_email;
    let html = `<a href=${link}>google</a>`;
    random[rand] = true;
    let hash_pass = hashed_password(req);
    console.log(req.body.user_password);
    try {
        // prettier-ignore
        let res_data = await api.query.insert(hash_pass, req.body.user_email, req.body.user_phone, 2);
        await customer.query.insertId(res_data.insertId);
        mailer(req.body.user_email, "sadasdasd", "ashgdhasdg", html);
    } catch (e) {
        console.log(e);
    }
});

router.post("/login", async function (req, res, next) {
    let hash_pass = hashed_password(req);
    let users = await api.query.getUserByEmail(req.body.user_email);
    if (users.length == 0) {
        res.json({
            er: "eroor"
        })
    } else {
        if (hash_pass == users[0].password) {
            let token = JWT.getToken(users[0].id);
            console.log(token);
            res.json(token);
        }
    }
    console.log(users);
});

router.get("/verify", async function (req, res) {
    if (req.protocol + "://" + req.get("host") == "http://" + host) {
        if (random[req.query.id]) { //email is verified
            delete random[req.query.id];
            await api.query.update_activated(1, req.query.user_mail);
        } else { //email is not verified

        }
    } else { //Request is from unknown source

    }
    res.redirect("/");
});

function hashed_password(req) {
    return crypto.HmacSHA1(req.body.user_password, config.get('secret_hash')).toString();
}

module.exports = router;