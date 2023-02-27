const predavacModel = require('../models/predavac');
const pitanjeModel = require('../models/pitanje');
const predavanjeModel = require('../models/predavanje');
module.exports = {
    provjeriAutentifikacijuPredavaca: function (req, res, next) {
        if (req.isAuthenticated() && !req.user.admin) {
            return next();
        } else if (req.isAuthenticated() && req.user.admin) {
            res.redirect('/admin');
        }
        res.redirect('/');
    },

    provjeriAutentifikacijuAdmina: function (req, res, next) {
        if (req.isAuthenticated() && req.user.admin) {
            return next();
        } else if (req.isAuthenticated() && !req.user.admin) {
            res.redirect('/pocetna');
        }
        res.redirect('/');
    },

    provjeriNeAutentifikaciju: function (req, res, next) {
        if (req.isAuthenticated() && !req.user.admin) {
            return res.redirect('/pocetna');
        } else if (req.isAuthenticated() && req.user.admin) {
            return res.redirect('/admin');
        }
        next();
    },

    dajPredavace: async function (req, res, next) {
        try {
            const result = await predavacModel.dajPredavace();
            req.predavaci = result.rows;
            next();
        } catch (err) {
            next(err);
        }
    },

    prikaziPredavace: async function (req, res, next) {
        res.render('administrator/predavaci', { title: 'Predavači', predavaci: req.predavaci });
    },

    obrisiPredavaca: async function (req, res, next) {
        try {
            await predavacModel.obrisiPredavaca(req.params.id);
            next();
        } catch (err) {
            next(err);
        }
    },

    blokirajPredavaca: async function (req, res, next) {
        let datum = new Date();
        let novi_datum = new Date();
        novi_datum.setDate(datum.getDate() + parseInt(req.body.dani));
        console.log(novi_datum);
        try {
            await predavacModel.blokirajPredavaca(req.params.id, novi_datum);
            next();
        } catch (err) {
            next(err);
        }
    },

    statistikaAdmin: async function (req, res, next) {
        try {
            const result = await predavacModel.dajBrojPredavaca();
            console.log(result.rows);
            req.brojPredavaca = result.rows[0].broj;
        } catch (err) {
            console.log(err)
        }
        try {
            const result = await predavacModel.dajBrojBlokiranihPredavaca();
            req.brojBlokiranihPredavaca = result.rows[0].broj;
            console.log(result.rows);
        } catch (err) {
            console.log(err)
        }
        try {
            const result = await predavanjeModel.dajBrojAktivnihPredavanja();
            req.brojAktivnihPredavanja = result.rows[0].broj;
            console.log(result.rows);
        } catch (err) {
            console.log(err)
        }
        try {
            const result = await pitanjeModel.dajBrojPostavljenihPitanja();
            req.brojPostavljenihPitanja = result.rows[0].broj;
            console.log(result.rows);
        } catch (err) {
            console.log(err)
        }
        try {
            const result = await pitanjeModel.dajBrojSakrivenihPitanja();
            req.brojSakrivenihPitanja = result.rows[0].broj;
            console.log(result.rows);
            //next();
        } catch (err) {
            console.log(err)
            //next(err);
        }
        res.render('administrator/admin', { title: 'Admin',
            predavaci: req.brojPredavaca, blokirani: req.brojBlokiranihPredavaca,
            aktivnaPredavanja: req.brojAktivnihPredavanja, pitanja: req.brojPostavljenihPitanja,
            sakrivena: req.brojSakrivenihPitanja
        });
    }
}
