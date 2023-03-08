const pool = require("../models/db_configuration");

module.exports = {
    getUsers: (req, res, next) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return res.send(err);
            }
            client.query(`SELECT * FROM users WHERE deleted = $1 AND admin = $1`,[false],
                function (err, result) {
                    done();
                    if (err) {
                        res.send(err);
                    }
                    req.users = result.rows;
                    next();
                });
        });
    },

    getEvents: (req, res, next) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return res.send(err);
            }
            client.query(`SELECT * FROM eventsNew where approved = $1 and declined = $1`,[false],
                function (err, result) {
                    done();
                    if (err) {
                        res.send(err);
                    }
                    req.events = result.rows;
                    next();
                });
        });
    },

    getApprovedEvents: (req, res, next) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return res.send(err);
            }
            client.query(`SELECT * FROM eventsNew where approved = $1`,[true],
                function (err, result) {
                    done();
                    if (err) {
                        res.send(err);
                    }
                    req.approved_events = result.rows;
                    next();
                });
        });
    },

    getDeclinedEvents: (req, res, next) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return res.send(err);
            }
            client.query(`SELECT * FROM eventsNew where declined = $1`,[true],
                function (err, result) {
                    done();
                    if (err) {
                        res.send(err);
                    }
                    req.events = result.rows;
                    next();
                });
        });
    },

    editApprovementEvent: (req, res, next) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return res.send(err);
            }
            client.query(`UPDATE eventsNew SET approved = $1 WHERE id = $2`,
                [req.body.approved, req.body.id],
                function (err, result) {
                    done();
                    if (err) {
                        res.send(err);
                    }
                    next();
                });
        });
    },

    editDeclinedEvent: (req, res, next) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return res.send(err);
            }
            client.query(`UPDATE eventsNew SET declined = $1 WHERE id = $2`,
                [req.body.declined, req.body.id],
                function (err, result) {
                    done();
                    if (err) {
                        res.send(err);
                    }
                    next();
                });
        });
    },
    editUser: (req, res, next) => {
        pool.connect(function (err, client, done) {
            if (err) {
                return res.send(err);
            }
            client.query(`UPDATE users SET deleted = $1 WHERE id = $2`,
                [req.body.deleted, req.body.id],
                function (err, result) {
                    done();
                    if (err) {
                        res.send(err);
                    }
                    next();
                });
        });
    }
}
