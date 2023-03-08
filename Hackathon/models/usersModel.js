const pool = require("../models/db_configuration");
const crypto = require("crypto");
module.exports = {
    register : (req, res, next, hashedPassword, salt) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return res.send(err);
            }
            client.query(`INSERT INTO users (email, password, salt, first_name, last_name) VALUES ($1, $2, $3, $4, $5)`,
                [req.body.email, hashedPassword, salt, req.body.first_name, req.body.last_name],
                function (err) {
                    done();
                    if (err) {
                        console.log(err);
                        return res.send(err);
                    }
                    var user = {
                        email: req.body.email
                    };
                    // req.login(user, function (err) {
                    //     if (err) {
                    //         return next(err);
                    //     }
                    //     res.redirect('/login');
                    // });
                    next();
                });
        });
    },

    authentication : (req, res, next, email, password, cb) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return res.send(err);
            }
            client.query(`SELECT * FROM users WHERE email = $1`, [email],
                function (err, result) {
                    done();
                    if (err) {
                        return cb(err);
                    }
                    if (!result.rows[0]) {
                        return cb(null, false, {message: 'Incorrect username or password.'});
                    }
                    crypto.pbkdf2(password, result.rows[0].salt, 310000, 32, 'sha256', function (err, hashedPassword) {
                        if (err) {
                            return cb(err);
                        }
                        if (!crypto.timingSafeEqual(result.rows[0].password, hashedPassword)) {
                            return cb(null, false, {message: 'Incorrect username or password.'});
                        }
                        return cb(null, result.rows[0]);
                    });
                });
        });
    },

    insertEvent: (req, res, next) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return res.send(err);
            }
            client.query(`INSERT INTO eventsNew (title, date, time, place, type, number_of_seats, userid) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [req.body.title, req.body.date, req.body.time, req.body.location, req.body.type, req.body.num_of_seats, req.user.id],
                function (err) {
                    done();
                    if (err) {
                        res.send(err);
                    }
                    next();
                });
        });
    },

    getEvents: (req, res, next) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return res.send(err);
            }
            client.query(`SELECT * FROM eventsNew WHERE userid = $1 AND approved = $2`, [req.user.id, true],
                function (err, result) {
                    done();
                    if (err) {
                        res.send(err);
                    }
                    req.events_details = result.rows;
                    next();
                });
        });
    },

    getEvent: (req, res, next) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return res.send(err);
            }
            client.query(`SELECT * FROM eventsNew WHERE id = $1 AND approved = $2`, [req.params.id, true],
                function (err, result) {
                    done();
                    if (err) {
                        res.send(err);
                    }
                    req.event_details = result.rows[0];
                    next();
                });
        });
    }

}
