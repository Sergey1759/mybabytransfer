var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
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
