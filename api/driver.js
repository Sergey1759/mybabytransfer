let connect = require('../database');

let query = {};

query.insertId = (user_id) => {
    return ConstructorQuery(`INSERT INTO drivers (user_id) VALUES('${user_id}');`)();
};

query.getById = (user_id) => {
    return ConstructorQuery(`select * from drivers where user_id = ${user_id}`)();
};

query.insert_vehicletypes_id = (vehicletypes_id, id) => {
    return ConstructorQuery(`Update drivers set vehicletypes_id="${vehicletypes_id}" where user_id = ${id}`)();
};

query.insert_time_id = (time_id, id) => {
    return ConstructorQuery(`Update drivers set time_id="${time_id}" where user_id = ${id}`)();
};

//vehicletypes_id


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