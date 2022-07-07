const Pool = require("pg").Pool

const pool = new Pool({
    user: "postgres",
    password: "dinodino",
    host: "localhost",
    port: 5432,
    database: "friendstracks"

});

module.exports = pool;

