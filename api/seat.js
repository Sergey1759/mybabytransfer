let connect = require('../database');

let query = {};


query.getById = (id) => {
    return ConstructorQuery(`select * from seat where id = ${id};`)();
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