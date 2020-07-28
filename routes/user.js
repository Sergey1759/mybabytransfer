let express = require("express");
let router = express.Router();

let middleware = require("../api/auth/middleware");
let api = require("../api/users");
let customer = require("../api/customer");
let driver = require("../api/driver");
let mailer = require("../service/mailer");
let randomstring = require("randomstring");
let crypto = require("crypto-js");
let config = require('config');

let JWT = require('../api/auth/token');
const users = require("../api/users");
let random = {};
let user_pass = {};
let host;
let multer = require('../service/multer');


router.get("/reset_password", function (req, res, next) {
    res.render("reset_password", {
        title: "Express",
    });
});

router.post("/confirm_email", async function (req, res, next) {
    console.log(req.body);
    let user = await users.query.getUserByEmail(req.body.email);
    console.log(user);
    if (user.length == 0) {
        res.send({
            error: "Не верно указанный email",
        });
    } else {
        res.send({
            ok: "ok"
        })
    }
});

router.post("/confirm_password", async function (req, res, next) {
    try {
        let rand = randomstring.generate(15);
        host = req.get("host");
        // prettier-ignore
        let link = "https://" + req.get("host") + "/users/verify_pass?id=" + rand + "&user_mail=" + req.body.email;
        let html = `
        <h1>Замена пароля</h1>
        <p>Для замены пароля перейдите по ссылке <a href=${link}>ссылке</a></p>
        <p>Если это были не вы то свяжетись с нами zakaz@babytransfer.com</p>
        `;
        let hash_pass = hashed_password(req);
        user_pass[rand] = hash_pass;
        mailer(req.body.email, "Администрация BabyTransfer", "Подтверждение замены пароля", html);
        res.send({
            ok: 'Вам отправленно письмо с ссылкой перейдите по ней для подтверждения пароля'
        })
    } catch (e) {
        res.send({
            error: e
        })
    }

});

router.post("/sign", async function (req, res, next) {
    let rand = randomstring.generate(15);
    host = req.get("host");
    // prettier-ignore
    let link = "https://" + req.get("host") + "/users/verify?id=" + rand + "&user_mail=" + req.body.user_email;
    let html = `
        <h1>Подтверждение регистрации</h1>
        <p>Для подтверждения регистрации перейдите по ссылке <a href=${link}>ссылке</a></p>
        <p>Если это были не вы то свяжетись с нами zakaz@babytransfer.com</p>
        `;
    random[rand] = true;
    let hash_pass = hashed_password(req);

    try {
        let roles = {
            'driver': 3,
            'customer': 2
        }
        let isUser = await api.query.getUserByEmail(req.body.user_email);
        if (isUser.length > 0) {
            res.send({
                error: 'такой email уже существует'
            });
        } else {
            // prettier-ignore
            let res_data = await api.query.insert(hash_pass, req.body.user_email, req.body.user_phone, roles[req.body.user_role]);
            if (req.body.user_role == 'driver') {
                await driver.query.insertId(res_data.insertId);
            } else if (req.body.user_role == 'customer') {
                await customer.query.insertId(res_data.insertId);
            }
            mailer(req.body.user_email, "Администрация BabyTransfer", "Подтверждение регистрации", html);
            res.send({
                confirm: 'Регистрация пройшла успешно, вам отправленно письмо с подтверждением на почту'
            });
        }

    } catch (e) {
        console.log(e);
    }
});

router.post("/login", async function (req, res, next) {
    let hash_pass = hashed_password(req);
    let users = await api.query.getUserByEmail(req.body.user_email);
    console.log(users[0]); //activated:


    if (users.length == 0) {
        res.json({
            er: "Не верный email или пароль"
        })
    } else if (users[0].activated == 0) {
        res.send({
            er: "Подтвердите email"
        });
    } else {
        if (hash_pass == users[0].password) {
            let token = JWT.getToken(users[0].id);
            res.json({
                token
            });
        } else {
            res.json({
                er: "Не верный email или пароль"
            })
        }
    }


    console.log(users);
});

router.get("/verify", async function (req, res) {
    if (req.protocol + "://" + req.get("host") == "https://" + host) {
        if (random[req.query.id]) { //email is verified
            delete random[req.query.id];
            await api.query.update_activated(1, req.query.user_mail);
        } else { //email is not verified
            console.log('Request is from unknown source');
        }
    } else { //Request is from unknown source
        console.log('Request is from unknown source');
    }
    res.redirect("/");
});
router.get("/verify_pass", async function (req, res) {
    if (req.protocol + "://" + req.get("host") == "https://" + host) {
        if (user_pass[req.query.id]) { //email is verified
            console.log(user_pass);
            await api.query.update_password_by_email(user_pass[req.query.id], req.query.user_mail);
            delete user_pass[req.query.id];
        } else { //email is not verified
            console.log('email is not verified');
        }
    } else { //Request is from unknown source
        console.log('Request is from unknown source');
    }
    res.redirect("/");
});

router.post("/logout", async function (req, res, next) {
    res.cookie('token', '');
    res.redirect('/orders/confirm_order/30')
});

router.post("/add_photo", multer, middleware, async function (req, res, next) {
    let avatar_url = `../../user_img/${req.file.filename}`;
    await api.query.update_avatar_url(avatar_url, req.user.userId)
});

function hashed_password(req) {
    return crypto.HmacSHA1(req.body.user_password, config.get('secret_hash')).toString();
}

module.exports = router;