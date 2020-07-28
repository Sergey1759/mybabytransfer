let express = require("express");
let router = express.Router();
let middleware = require("../api/auth/middleware");
let users = require("../api/users");
const driver = require("../api/driver");
const car = require("../api/car");
const car_seats = require("../api/carseats");
const time = require("../api/time");

router.get("/profile/", middleware, async function (req, res, next) {
    let user = await users.query.getUserById(req.user.userId);
    console.log(user);
    if (user[0].role_id == 2) {
        res.redirect('/customer/profile');
    } else {
        user = user[0];
        let driver_l = await driver.query.getById(req.user.userId);
        let driver_car = await car.query.getById(driver_l[0].vehicletypes_id);
        let driver_time = await time.query.getById(driver_l[0].time_id);
        driver_car = driver_car[0];
        driver_time = driver_time[0];
        console.log(driver_time);
        let carseats_l = await car_seats.query.getById(driver_l[0].id);
        console.log(carseats_l);
        try {
            driver_car.isTypes = {
                standard: driver_car.type == 'standard' ? true : false,
                comfort: driver_car.type == 'comfort' ? true : false,
                business: driver_car.type == 'business' ? true : false,
            }
        } catch (e) {
            console.log(e);
        }



        res.render("driver_profile", {
            title: "MyBabytransfer",
            user,
            driver_car,
            driver_time,
            carseats_l
        });
    }
});

router.post("/profile/", middleware, async function (req, res, next) {
    for (const iterator in req.body.user) {
        if (iterator == 'name') {
            await users.query.update_name(req.body.user[iterator], req.user.userId);
        }
        if (iterator == 'lastname') {
            await users.query.update_lastname(req.body.user[iterator], req.user.userId);
        }
        if (iterator == 'city') {
            await users.query.update_city(req.body.user[iterator], req.user.userId);
        }
        if (iterator == 'bank_card') {
            await users.query.update_bank_card(req.body.user[iterator], req.user.userId);
        }
    }
    let user_auto = await driver.query.getById(req.user.userId);
    let auto = req.body.auto;
    console.log(auto);
    let type_autos = {
        'standard': 1,
        'comfort': 2,
        'business': 3,
    }
    let g_type_auto = type_autos[req.body.auto];
    if (user_auto[0].vehicletypes_id == 0) {
        let driver_car = await car.query.insert(g_type_auto, auto.number_auto, auto.description_auto, 4, 250, 6, 17);
        console.log(driver_car[0]);
        await driver.query.insert_vehicletypes_id(driver_car.insertId, req.user.userId);
    } else {

        // for (const iterator in auto) {
        //     if (iterator == 'name') {
        //         await users.query.update_name(auto[iterator], req.user.userId);
        //     }
        //     if (iterator == 'lastname') {
        //         await users.query.update_lastname(auto[iterator], req.user.userId);
        //     }
        //     if (iterator == 'city') {
        //         await users.query.update_city(auto[iterator], req.user.userId);
        //     }
        //     if (iterator == 'bank_card') {
        //         await users.query.update_bank_card(auto[iterator], req.user.userId);
        //     }
        // }
    }

    if (req.body.time && user_auto[0].time_id == 0) {
        let time_l = req.body.time;
        let driver_time = await time.query.insert(time_l.start_working, time_l.stop_working);
        console.log(driver_time);
        // driver_time = driver_time[0]
        await driver.query.insert_time_id(driver_time.insertId, req.user.userId);
    }

    if (req.body.child) {
        let child = req.body.child;
        console.log(child);
        for (const iterator of child) {
            await car_seats.query.insert(user_auto[0].id, iterator.value);
        }
    }




    console.log(req.body.user);

});

module.exports = router;