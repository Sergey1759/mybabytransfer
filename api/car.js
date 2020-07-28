let connect = require('../database');

let query = {};

query.insert = (type, number, description, number_of_places, price_for_call, price_for_down_time, price_for_km) => {
    return ConstructorQuery(`INSERT INTO vehicletypes (type_id,number,description,number_of_places,price_for_call,price_for_down_time,price_for_km) VALUES('${type}','${number}','${description}','${number_of_places}','${price_for_call}','${price_for_down_time}','${price_for_km}');`)();
};

query.getById = (id) => {
    return ConstructorQuery(`select * from vehicletypes where id = ${id};`)();
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