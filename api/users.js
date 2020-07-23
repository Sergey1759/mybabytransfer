let connect = require('../database');

let query = {};

query.insert = (password, email, phone, role_id) => {
    return ConstructorQuery(`INSERT INTO users (password,email,phone,role_id) VALUES('${password}','${email}','${phone}','${role_id}');`)();
};

query.update_activated = (isActivated, user_mail) => {
    return ConstructorQuery(`Update users set activated="${isActivated}" where email = '${user_mail}'`)();
};

query.update_name = (name, id) => {
    return ConstructorQuery(`Update users set first_name="${name}" where id = ${id}`)();
};

query.update_lastname = (lastname, id) => {
    return ConstructorQuery(`Update users set last_name="${lastname}" where id = ${id}`)();
};

query.update_bank_card = (bank_card, id) => {
    return ConstructorQuery(`Update users set bank_card="${bank_card}" where id = ${id}`)();
};

query.update_city = (city, id) => {
    return ConstructorQuery(`Update users set city="${city}" where id = ${id}`)();
};

query.update_password_by_email = (password, email) => {
    return ConstructorQuery(`Update users set password="${password}" where email = '${email}'`)();
};

query.getUserByEmail = (user_mail) => {
    return ConstructorQuery(`select * from users where email = '${user_mail}'`)();
};
query.getUserById = (id) => {
    return ConstructorQuery(`select * from users where id = ${id}`)();
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