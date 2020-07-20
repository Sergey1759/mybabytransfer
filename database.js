var mysql = require('mysql');
var connection = mysql.createConnection({
<<<<<<< HEAD
    host: 'localhost',
=======
    host: '185.128.235.174',
>>>>>>> 66a1d797e6458085211a8792b49d805cb3f52a59
    user: 'gps123',
    database: 'babygps',
    password: '5N5t5U7x'
});

connectDatabase = () => {
    try {
        connection.connect();
    } catch (e) {
        console.log(e);
    }

}

module.exports = {
    connectDatabase,
    connection
};
