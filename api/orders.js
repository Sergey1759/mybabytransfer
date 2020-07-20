let connect = require('../database');

let query = {};

query.insert = (customer_id, arrive_time, calling_time, backandforth, comment, distance, cost, status_id, time_created_order) => {
    return ConstructorQuery(`INSERT INTO orders (customer_id, arrival_time, calling_time,backandforth,comment,distance,cost,status_id,time_created_order) VALUES('${customer_id}','${arrive_time}','${calling_time}','${backandforth}','${comment}','${distance}','${cost}','${status_id}','${time_created_order}');`)();
};

query.get_all = () => {
    return ConstructorQuery(`select * from orders;`)();
};
query.get_by_id = (id) => {
    return ConstructorQuery(`select * from orders where id = ${id};`)();
};

query.get_ten = (id) => {
    let from = id == 1 ? 0 : ((10 * id) - 10);
    let to = id * 10;
    console.log(from);
    console.log(to);
    return ConstructorQuery(`select * from orders limit ${from} , 10;`)();
};


function ConstructorQuery(query) {
    return function () {
        return new Promise((resolve, reject) => {
            connect.connection.query(query,
                function (err, rows, fields) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(rows);
                });
        })
    }
}
module.exports = {
    query
}