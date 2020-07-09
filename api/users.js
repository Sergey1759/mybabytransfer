let connect = require('../database');

let query = {};

query.insert = (password, email, phone, role_id) => {
    return ConstructorQuery(`INSERT INTO users (password,email,phone,role_id) VALUES('${password}','${email}','${phone}','${role_id}');`)();
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