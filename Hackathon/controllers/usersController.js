const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const db = require("../models/usersModel")

module.exports = {
    loginUser: passport.authenticate('local', {
        successReturnToOrRedirect: '/admin',
        failureRedirect: '/login',
        failureMessage: true
    }),

    decide: (req, res, next) => {
            if(req.isAuthenticated() && req.user.admin){
                next();
            }
            else if(req.isAuthenticated()) res.redirect('/user');

    },

    authAdmin: function (req, res, next) {
        if(!req.isAuthenticated()) {
            res.redirect('/login');
        }
        if (req.isAuthenticated() && req.user.admin) {
            next();
        }
        if (req.isAuthenticated() && !req.user.admin) {
            res.redirect('/user');
        }
    },

    authUser: function (req, res, next) {
        if(!req.isAuthenticated()) {
            res.redirect('/login');
        }
        if (req.isAuthenticated() && !req.user.admin) {
            next();
        }
        if (req.isAuthenticated() && req.user.admin) {
            res.redirect('/admin');
        }

    },

    notAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.admin)
                res.redirect('/admin');
            else
                res.redirect('/user');
        }
        next();
    },

    logoutUser: (req, res, next) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/login');
        });
    },

    renderForRegister: (req, res) => {
        res.render('register', {title: 'Register'});
    },

    registerUser: (req, res, next) => {
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) {
                return next(err);
            }
            db.register(req, res, next, hashedPassword, salt);
            res.redirect('/login');
        });

    },

    serializeUser: () => {
        passport.serializeUser(function (user, cb) {
            process.nextTick(function () {
                cb(null, {id: user.id, admin: user.admin});
            });
        });
    },

    deserializeUser: () => {
        passport.deserializeUser(function (user, cb) {
            process.nextTick(function () {
                return cb(null, user);
            });
        });
    },

    authentication: (req, res, next) => {
        passport.use(new LocalStrategy({usernameField: 'email'}, function verify(email, password, cb) {
            db.authentication(req, res, next, email, password, cb);
        }));
    },

    insertEvent: (req, res, next) => {
        db.insertEvent(req, res, next);
    },

    getEvents: (req, res, next) => {
        db.getEvents(req, res, next);
    },

    getEvent: (req, res, next) => {
        db.getEvent(req, res, next);
    }
}