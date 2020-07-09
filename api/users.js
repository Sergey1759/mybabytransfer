let connect = require('../database');

let query = {};

query.insert = (password, email, phone, role_id) => {
    return ConstructorQuery(`INSERT INTO users (password,email,phone,role_id) VALUES('${password}','${email}','${phone}','${role_id}');`)();
};

query.update_activated = (isActivated, user_mail) => {
    return ConstructorQuery(`Update users set activated="${isActivated}" where email = '${user_mail}'`)();
};

query.getUserByEmail = (user_mail) => {
    return ConstructorQuery(`select * from users where email = '${user_mail}'`)();
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