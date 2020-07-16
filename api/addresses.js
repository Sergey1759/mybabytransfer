let connect = require('../database');

let query = {};

query.insert = (id_order, id_addresess) => {
    return ConstructorQuery(`INSERT INTO addresses (id_order,id_addresess) VALUES('${id_order}','${id_addresess}');`)();
};

query.getById = (id_order) => {
    return ConstructorQuery(`select addresses.id_order , address.address from addresses, address where addresses.id_addresess = address.id && addresses.id_order = ${id_order};`)();
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