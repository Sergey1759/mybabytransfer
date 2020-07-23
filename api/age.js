let connect = require('../database');

let query = {};

query.insert = (order_id, age) => {
    return ConstructorQuery(`INSERT INTO age (order_id,age) VALUES('${order_id}','${age}');`)();
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