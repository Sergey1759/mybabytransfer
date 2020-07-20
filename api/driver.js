let connect = require('../database');

let query = {};

query.insertId = (user_id) => {
    return ConstructorQuery(`INSERT INTO drivers (user_id) VALUES('${user_id}');`)();
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