const pool = require("../models/db_configuration");
const crypto = require("crypto");
module.exports = {
    getEvents: (req, res, next) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return res.send(err);
            }
            client.query(`SELECT * FROM eventsNew WHERE type = $1 AND approved = $2`, [req.params.type, true],
                function (err, result) {
                    done();
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                    console.log(result);
                    req.events = result.rows;
                    next();
                });
        });
    },

    getEventsIDS: (req, res, next) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return res.send(err);
            }
            client.query(`SELECT * FROM eventsNew WHERE id = $1`, [req.params.id],
                function (err, result) {
                    done();
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                    console.log(result.rows);
                    req.events = result.rows[0];
                    next();
                });
        });
    },

    saveReservation: (req, res, next) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return res.send(err);
            }
            client.query(`INSERT INTO reservations (first_name, last_name, email, phone, eventID) VALUES 
                ($1, $2, $3, $4, $5)`,
                [req.body.first_name, req.body.last_name, req.body.email, req.body.phone, req.body.eventID],
                function (err) {
                    done();
                    if (err) {
                        res.send(err);
                    }
                    next();
                });
        });
    }
}