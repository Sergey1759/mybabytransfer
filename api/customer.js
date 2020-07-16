let connect = require('../database');

let query = {};

query.insertId = (user_id) => {
    return ConstructorQuery(`INSERT INTO customers (user_id) VALUES('${user_id}');`)();
};

query.find_by_userId = (user_id) => {
    return ConstructorQuery(`select * from customers where user_id = ${user_id}`)();
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