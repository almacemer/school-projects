const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const pool = require('../db');
const crypto = require('crypto');
const GoogleStrategy = require('passport-google-oidc');
const FacebookStrategy = require('passport-facebook');
const predavacKontroler = require('../controllers/predavac');
const predavanjeKontroler = require("../controllers/predavanje");
const router = express.Router();

function spremiPredavaca (req, res, next) {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return next(err); }
        pool.connect(function (err, client, done) {
            if (err) {
                return res.send(err);
            }
            client.query(`INSERT INTO predavaci (ime, prezime, email, password, salt) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [req.body.ime, req.body.prezime, req.body.email, hashedPassword, salt],
                function (err, result) {
                    done();
                    if (err) {
                        return res.send(err);
                    }
                    var user = {
                        id: result.rows[0].id,
                        email: req.body.email,
                        ime: req.body.ime,
                        prezime: req.body.prezime
                    };
                    req.login(user, function(err) {
                        if (err) { return next(err); }
                        res.redirect('/login');
                    });
                });
            // client.query(`INSERT INTO admin (email, password, salt) VALUES ($1, $2, $3)`,
            //     [req.body.email, hashedPassword, salt],
            //     function (err) {
            //         done();
            //         if (err) {
            //             return res.send(err);
            //         }
            //         var user = {
            //             email: req.body.email,
            //             admin: true
            //         };
            //         console.log('password: ', hashedPassword);
            //         console.log('salt: ', salt);
            //         req.login(user, function(err) {
            //             if (err) { return next(err); }
            //             res.redirect('/login');
            //         });
            //     });
        });
    });
}

passport.use(new LocalStrategy({usernameField: 'email'}, function verify(email, password, cb) {
    var user;
    pool.connect(async function (err, client1, done) {
        if (err) {
            return console.log(err);
        }
        client1.query(`SELECT * FROM predavaci WHERE email = $1 AND obrisan = $2 AND (blokiran_do < $3 OR blokiran_do IS null)`,
            [ email, false, new Date() ],
            function (err, result) {
                done();
                if (err) { return cb(err); }
                if (!result.rows[0]) {
                    pool.connect(async function (err, client2, done) {
                        if (err) { return console.log(err); }

                        client2.query(`SELECT * FROM admin WHERE email = $1`, [ email ],
                            function (err, result) {
                                done();
                                if (err) {
                                    return cb(err);
                                }
                                if (!result.rows[0]) {
                                    return cb(null, false, { message: 'Ne postoji korisnik sa unesenim emailom.'});
                                } else {
                                    user = result.rows[0];
                                    user.admin = true;
                                    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
                                        if (err) { return cb(err); }
                                        console.log(hashedPassword)
                                        if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                                            return cb(null, false, { message: 'Netačan password.' });
                                        }

                                        return cb(null, user);
                                    });
                                }
                            });
                    });
                } else {
                    user = result.rows[0];
                    user.admin = false;
                    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
                        if (err) { return cb(err); }
                        console.log(hashedPassword)
                        if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                            return cb(null, false, { message: 'Netačan password.' });
                        }

                        return cb(null, user);
                    });
                }

            });
    });
}));

passport.use(new GoogleStrategy({
        clientID: process.env['GOOGLE_CLIENT_ID'],
        clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
        callbackURL: '/oauth2/redirect/google',
        scope: [ 'profile', 'email' ]
    }, function verify(issuer, profile, cb) {
        pool.connect(function (err, client1, done) {
            if (err) {
                return cb(err);
            }
            client1.query(`SELECT * FROM federated_credentials WHERE provider = $1 AND subject = $2`,
                [issuer, profile.id],
                function (err, result) {
                    done();
                    if (err) { return cb(err); }
                    if (!result.rows[0]) {
                        pool.connect(function (err, client2, done) {
                            if (err) {
                                return cb(err);
                            }
                            client2.query(`INSERT INTO predavaci (ime, email) VALUES ($1, $2) RETURNING id`,
                                [profile.displayName, profile.emails[0].value],
                                function (err, result) {
                                    done();
                                    if (err) { return cb(err); }
                                    const id = result.rows[0].id;
                                    console.log("id: " + id);
                                    pool.connect(function (err, client3, done) {
                                        if (err) {
                                            return cb(err);
                                        }
                                        client3.query(`INSERT INTO federated_credentials (user_id, provider, subject) VALUES ($1, $2, $3)`,
                                            [id, issuer, profile.id],
                                            function (err) {
                                                done();
                                                console.log('profil', profile.emails);
                                                if (err) { return cb(err); }
                                                var user = {
                                                    id: id,
                                                    ime: profile.displayName,
                                                    email: profile.emails[0].value
                                                };
                                                return cb(null, user);
                                            });
                                    });
                                });
                        });
                    } else {
                        pool.connect(function (err, client, done) {
                            if (err) {
                                return cb(err);
                            }
                            client.query(`SELECT * FROM predavaci WHERE id = $1 AND obrisan = $2 AND (blokiran_do < $3 OR blokiran_do IS null)`,
                                [result.rows[0].user_id, false, new Date()],
                                function (err, result) {
                                    done();
                                    if (err) { return cb(err); }
                                    if (!result.rows[0]) { return cb(null, false); }
                                    return cb(null, result.rows[0]);
                                }
                            );
                        });
                    }
                });
        });
 }));

passport.use(new FacebookStrategy({
    clientID: process.env['FACEBOOK_CLIENT_ID'],
    clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
    callbackURL: '/oauth2/redirect/facebook',
    state: true
}, function verify(accessToken, refreshToken, profile, cb) {
    pool.connect(function (err, client1, done) {
        if (err) { return cb(err); }
        client1.query(`SELECT * FROM federated_credentials WHERE provider = $1 AND subject = $2`,
            ['https://www.facebook.com', profile.id],
            function (err, result) {
                done();
                if (err) { return cb(err); }
                if (!result.rows[0]) {
                    pool.connect(function (err, client2, done) {
                        if (err) { return cb(err); }
                        client2.query(`INSERT INTO predavaci (ime) VALUES ($1) RETURNING id`,
                            [ profile.displayName ],
                            function (err, result) {
                                done();
                                if (err) { return cb(err); }
                                const id = result.rows[0].id;
                                pool.connect(function (err, client3, done) {
                                    if (err) { return cb(err); }
                                    client3.query(`INSERT INTO federated_credentials (user_id, provider, subject) VALUES ($1, $2, $3)`,
                                        [id, 'https://www.facebook.com', profile.id],
                                        function (err) {
                                            done();
                                            if (err) { return cb(err); }
                                            const user = {
                                                id: id,
                                                name: profile.displayName
                                            };
                                            return cb(null, user);
                                        });
                                });
                            });
                    });
                } else {
                    pool.connect(function (err, client, done) {
                        if (err) { return cb(err); }
                        client.query(`SELECT * FROM predavaci WHERE id = $1 AND obrisan = $2 AND (blokiran_do < $3 OR blokiran_do IS null)`,
                            [ result.rows[0].user_id, false, new Date() ],
                            function (err, result) {
                                done();
                                if (err) { return cb(err); }
                                return cb(null, result.rows[0]);
                            });
                    });
                }
            });
    });
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, email: user.email, ime: user.ime, prezime: user.prezime, admin: user.admin });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});


router.get('/login', predavacKontroler.provjeriNeAutentifikaciju, function(req, res, next) {
    res.render('login');
});

router.post('/login/password', predavacKontroler.provjeriNeAutentifikaciju, passport.authenticate('local', {
    successReturnToOrRedirect: '/pocetna',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/login/federated/google', predavacKontroler.provjeriNeAutentifikaciju, passport.authenticate('google'));

router.get('/oauth2/redirect/google', predavacKontroler.provjeriNeAutentifikaciju, passport.authenticate('google', {
    successReturnToOrRedirect: '/pocetna',
    failureRedirect: '/login'
}));

router.get('/login/federated/facebook', predavacKontroler.provjeriNeAutentifikaciju, passport.authenticate('facebook'));

router.get('/oauth2/redirect/facebook', predavacKontroler.provjeriNeAutentifikaciju, passport.authenticate('facebook', {
    successRedirect: '/pocetna',
    failureRedirect: '/login'
}));

router.get('/registracija', predavacKontroler.provjeriNeAutentifikaciju, function(req, res, next) {
    res.render('registracija', { title: 'Slido', kod_nije_validan: '' });
});

router.post('/registracija', predavacKontroler.provjeriNeAutentifikaciju, spremiPredavaca);

router.post('/unos-koda', predavacKontroler.provjeriNeAutentifikaciju, predavanjeKontroler.dajAktivnoPredavanje)


router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;
