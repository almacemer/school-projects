var pg = require('pg');

var config = {
    user: process.env['PGUSER'],
    database: process.env['PGDATABASE'],
    password: process.env['PGPASSWORD'],
    host: 'localhost',
    port: process.env['PGPORT'],
    max: 100,
    idleTimeoutMillis: 30000,
};

module.exports = new pg.Pool(config);