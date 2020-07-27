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
let Api_age = require("../api/age");
const age = require("../api/age");

let types_car = {
    1: 'Стандарт',
    2: 'Комфорт',
    3: 'Бизнес',
}

router.get("/page/:id", middleware, async function (req, res, next) {
    console.log("Cookies: ", req.cookies);
    let orders = await Api_orders.query.get_ten(req.params.id);
    let raw_count_orders = await Api_orders.query.get_count_orders();
    let count_orders = raw_count_orders[0].count;
    let isStart = false;
    let isEnd = false;

    let page = count_orders - (10 * req.params.id);
    let last_page;
    if (count_orders % 10 == 0) {
        last_page = count_orders / 10;
    } else {
        last_page = parseInt(count_orders / 10) + 1;
    }



    let pages = {
        start: 1,
        prev_prev: (req.params.id - 2) <= 0 ? false : (req.params.id - 2),
        prev: (req.params.id - 1) <= 0 ? false : (req.params.id - 1),
        now: req.params.id,
        next: last_page - req.params.id < 1 ? false : +req.params.id + 1,
        next_next: last_page - req.params.id < 2 ? false : +req.params.id + 2,
        end: last_page,
    };
    console.log(last_page - req.params.id)

    for (const order of orders) {
        order.calling_time = `${order.calling_time.getUTCDate()}/${order.calling_time.getUTCMonth() + 1} ${order.calling_time.getHours()}:${order.calling_time.getMinutes()}`;
        order.arrival_time = `${order.arrival_time.getUTCDate()}/${order.arrival_time.getUTCMonth() + 1} ${order.arrival_time.getHours()}:${order.arrival_time.getMinutes()}`;
        order.time_created_order = `${order.time_created_order.getUTCDate()}/${order.time_created_order.getUTCMonth()+1}`;
        let addresses = await Api_addresses.query.getById(order.id);
        order.address_start = addresses[0].address;
        order.address_end = addresses[1].address;
    }
    res.render("orders", {
        title: "MyBabytransfer",
        orders,
        pages
    });
});
router.get("/new_order", middleware, async function (req, res, next) {
    res.render("new_order", {
        title: "MyBabytransfer",
    });
});



router.get("/confirm_order/:id", middleware, async function (req, res, next) {
    let order = await Api_orders.query.get_by_id(req.params.id);
    let order_l = order[0];
    let address = await Api_addresses.query.getById(order_l.id);
    order_l.start = address[0].address;
    order_l.end = address[1].address;

    order_l.start_address = getStr(address[0].address);
    order_l.end_address = getStr(address[1].address);
    order_l.calling_time = get_date(order_l.calling_time);
    order_l.arrival_time = get_date(order_l.arrival_time);

    order_l.type_id = types_car[order_l.type_id];
    // console.log(types_car[order_l.type_id]);
    // console.log(order_l.type_id);

    let age_child = await age.query.getByOrderId(order_l.id);
    console.log(order_l);
    order_l.child = [];


    for (const iterator of age_child) {
        order_l.child.push(createChild(iterator.age));
    }

    function getStr(str) {
        let string = str.split(',');
        string.splice(1, string.length);
        return string.join(' , ');
    }
    res.render("confirm_order", {
        title: "MyBabytransfer",
        order_l
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


    let arrive_time = get_arrive_time(req.body.date, m[0].duration.value);
    let customer = await Api_customers.query.find_by_userId(req.user.userId);
    let customer_id = customer[0].id;
    console.log(customer_id);
    let date = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);
    let calling_date = new Date(req.body.date);

    let type_car = {
        'standard': 1,
        'comfort': 2,
        'business': 3,
    }


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
        type_car[req.body.type_auto]
    );
    let start_address = await Api_address.query.insert_address(m[0].start_address);
    let end_address = await Api_address.query.insert_address(m[0].end_address);

    await Api_addresses.query.insert(order.insertId, start_address.insertId);
    await Api_addresses.query.insert(order.insertId, end_address.insertId);

    for (const iterator of req.body.babies) {
        await age.query.insert(order.insertId, get_child_age(iterator));
    }


    res.status(200).send({
        order: order.insertId
    })


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

function get_child_age(obj) {
    return obj.years * 12 + (+obj.month);
}

function get_date(date) {
    return `${new Date(date).getUTCHours()}:${new Date(date).getUTCMinutes()} ${new Date(date).getUTCDate()}/${ new Date(date).getUTCMonth() + 1}/${new Date(date).getUTCFullYear()}`
}

function createChild(age) {
    let years = parseInt(age / 12);
    let month = age % 12;
    switch (years) {
        case 0:
            years = '';
            break;
        case 1:
            years = '1 год';
            break;
        case 2:
            years = '2 года ';
            break;
        case 3:
            years = '3 года ';
            break;
        case 4:
            years = '4 года ';
            break;
        case 5:
            years = '5 лет ';
            break;
        case 6:
            years = '6 лет ';
            break;
        case 7:
            years = '7 лет ';
            break;
        case 8:
            years = '8 лет';
            break;
        case 9:
            years = '9 лет';
            break;
        case 10:
            years = '10 лет';
            break;
        case 11:
            years = '11 лет';
            break;
        case 12:
            years = '12 лет';
            break;

        default:
    }
    switch (month) {
        case 0:
            month = '';
            break;
        case 1:
            month = '1 месяц';
            break;
        case 2:
            month = '2 месяца';
            break;
        case 3:
            month = '3 месяца';
            break;
        case 4:
            month = '4 месяца';
            break;
        case 5:
            month = '5 месяцев';
            break;
        case 6:
            month = '6 месяцев';
            break;
        case 7:
            month = '7 месяцев';
            break;
        case 8:
            month = '8 месяцев';
            break;
        case 9:
            month = '9 месяцев';
            break;
        case 10:
            month = '10 месяцев';
            break;
        case 11:
            month = '11 месяцев';
            break;

        default:
    }
    let str;
    if (month == "") {
        str = years;
    } else if (years == "") {
        str = month;
    } else if (month != "" && years != "") {
        str = years + ' и ' + month;
    }
    return str;
}