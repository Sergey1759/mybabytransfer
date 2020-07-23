let connect = require('../database');

let query = {};

query.insert = (start_working, stop_working) => {
    return ConstructorQuery(`INSERT INTO times (start_working , stop_working) VALUES('${start_working}','${stop_working}');`)();
};

query.getById = (id) => {
    return ConstructorQuery(`select * from times where id = ${id};`)();
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