var mysql = require("mysql2/promise");

var pool;

module.exports = function getPool() {
  try {

    if (pool) {
      return pool;
    }
    const config = {
      host: 'localhost', // process.env.HOST
      port: 3306,
      user: 'root',
      password: '',//Put Instance ID for AWS HERE,
      database: 'lox',
      //connectionLimit: 10,
      //waitForConnections: true,
      //queueLimit: 0,
    };

    pool = mysql.createPool(config);
    return pool;
  } catch (error) {
    return console.log(`Could not connect - ${error}`);
  }
};
