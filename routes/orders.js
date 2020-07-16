let express = require("express");
let router = express.Router();
let middleware = require("../api/auth/middleware");
let google_maps = require("../service/google_maps");
let get_price = require("../service/get_price");
let get_arrive_time = require("../service/get_arrive_time");
let Api_orders = require("../api/orders");
let Api_customers = require("../api/customer");
let Api_address = require("../api/address");
let Api_addresses = require("../api/addresses");

router.get("/", middleware, async function (req, res, next) {
    console.log("Cookies: ", req.cookies);
    let orders = await Api_orders.query.get_all();

    console.log(orders);

    for (const order of orders) {
        order.calling_time = `${order.calling_time.getUTCDate()}/${order.calling_time.getUTCMonth()} ${order.calling_time.getHours()}:${order.calling_time.getMinutes()}`;
        order.arrival_time = `${order.arrival_time.getUTCDate()}/${order.arrival_time.getUTCMonth()} ${order.arrival_time.getHours()}:${order.arrival_time.getMinutes()}`;
        order.time_created_order = `${order.time_created_order.getUTCDate()}/${order.time_created_order.getUTCMonth()}`;
        let addresses = await Api_addresses.query.getById(order.id);
        order.address_start = addresses[0].address;
        order.address_end = addresses[1].address;
    }
    res.render("orders", {
        title: "MyBabytransfer",
        orders
    });
});
router.get("/new_order", middleware, async function (req, res, next) {
    res.render("new_order", {
        title: "MyBabytransfer",
    });
});

router.get("/confirm_order", middleware, async function (req, res, next) {
    res.render("confirm_order", {
        title: "MyBabytransfer",
    });
});

router.post("/create", middleware, async function (req, res, next) {
    let m = await google_maps.get(
        req.body.Filing_Address,
        req.body.Shipping_Address
    );
    let price = get_price(
        req.body.type_auto,
        m[0].distance.value,
        req.body.round_trip
    );
    console.log(req.user.userId);
    console.log(price);
    // console.log(m[0]);

    let arrive_time = get_arrive_time(req.body.date, m[0].duration.value);
    let customer = await Api_customers.query.find_by_userId(req.user.userId);
    let customer_id = customer[0].id;
    let date = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);
    let calling_date = new Date(req.body.date);
    console.log(date.toMysqlFormat());
    let order = await Api_orders.query.insert(
        customer_id,
        arrive_time.toMysqlFormat(),
        calling_date.toMysqlFormat(),
        +req.body.round_trip,
        req.body.comment,
        price.distance_local,
        price.price,
        1,
        date.toMysqlFormat(),
    );
    let start_address = await Api_address.query.insert_address(m[0].start_address);
    let end_address = await Api_address.query.insert_address(m[0].end_address);

    await Api_addresses.query.insert(order.insertId, start_address.insertId);
    await Api_addresses.query.insert(order.insertId, end_address.insertId);

    // let from = await Api_address.query.insert_address();
    // let from = console.log(order.insertId);
});

module.exports = router;

function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function () {
    return (
        this.getUTCFullYear() +
        "-" +
        twoDigits(1 + this.getUTCMonth()) +
        "-" +
        twoDigits(this.getUTCDate()) +
        " " +
        twoDigits(this.getUTCHours()) +
        ":" +
        twoDigits(this.getUTCMinutes()) +
        ":" +
        twoDigits(this.getUTCSeconds())
    );
};