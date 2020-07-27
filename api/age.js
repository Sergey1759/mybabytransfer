let connect = require('../database');

let query = {};

query.insert = (order_id, age) => {
    return ConstructorQuery(`INSERT INTO age (order_id,age) VALUES('${order_id}','${age}');`)();
};
query.getByOrderId = (order_id) => {
    return ConstructorQuery(`select * from age where order_id = ${order_id};`)();
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