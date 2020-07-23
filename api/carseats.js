let connect = require('../database');

let query = {};


query.insert = (driver_id, seat_id) => {
    return ConstructorQuery(`insert into carseats (driver_id,seat_id) VALUES( '${driver_id}','${seat_id}')`)();
};

query.getById = (driver_id) => {
    return ConstructorQuery(`select * from carseats where driver_id = ${driver_id};`)();
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