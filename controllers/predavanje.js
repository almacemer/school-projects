const crypto = require('crypto');
const predavanjeModel = require('../models/predavanje');
const QRCode = require('qrcode');
const multer = require("multer");
const pool = require("../db");
const pitanjaModel = require("../models/pitanje");
const nodemailer = require("nodemailer");
var io = null;
var poruke = [];
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

const upload = multer({storage: storage, fileFilter: fileFilter});

const trenutniDatum = new Date();
const mjesec = (trenutniDatum.getMonth() + 1 < 10) ? "0" + String(trenutniDatum.getMonth() + 1) : String(trenutniDatum.getMonth() + 1);
const dan = (trenutniDatum.getDate() < 10) ? "0" + String(trenutniDatum.getDate()) : String(trenutniDatum.getDate());
const datum = String(trenutniDatum.getFullYear()) + "-" + mjesec + "-" + dan;

function obradiDatumZaHtml(datum) {
    const mjesec = (datum.getMonth() + 1 < 10) ? "0" + String(datum.getMonth() + 1) : String(datum.getMonth() + 1);
    const dan = (datum.getDate() < 10) ? "0" + String(datum.getDate()) : String(datum.getDate());
    return String(datum.getFullYear()) + "-" + mjesec + "-" + dan;
}

function obradiDatum(datum) {
    const mjesec = (datum.getMonth() < 10) ? "0" + String(datum.getMonth() + 1) : String(datum.getMonth() + 1);
    const dan = (datum.getDate() < 10) ? "0" + String(datum.getDate()) : String(datum.getDate());
    const novi_datum = String(dan + "/" + mjesec + "/" + datum.getFullYear());
    return novi_datum;
}

function obradiDatume(predavanja) {
    const datumi = [];
    for (let i = 0; i < predavanja.length; i++) {
        const datum = obradiDatum(predavanja[i].kdatum);
        datumi.push(datum);
    }
    return datumi;
}

const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env['EMAIL'],
        pass: process.env['EMAIL_PASSWORD']
    }
});

module.exports = {
    dajPredavanje: async function (req, res, next) {
        const kod_predavanja = req.body.kod ? req.body.kod : req.params.kod;
        try {
            const result = await predavanjeModel.dajPredavanje(kod_predavanja);
            req.predavanje = result.rows[0];
            next();
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    dajAktivnoPredavanje: async function (req, res, next) {
        const kod_predavanja = req.body.kod ? req.body.kod : req.params.kod;
        try {
            const result = await predavanjeModel.dajPredavanje(kod_predavanja);

            if (result.rows.length === 0 || result.rows[0].kdatum < new Date()) {
                req.flash('kod_nije_validan', 'Kod nije validan. Molimo unesite ispravan kod.');
                if (req.originalUrl === '/unos-koda')
                    res.redirect('/registracija');
                else
                    res.redirect('/');
            } else {
                req.predavanje = result.rows[0];
                if (req.originalUrl === '/' || req.originalUrl === '/unos-koda')
                    res.redirect(`/predavanje/pitanja/${kod_predavanja}`);
                else
                    next();
            }

        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    dajAktivnaPredavanja: async function (req, res, next) {
        try {
            const result = await predavanjeModel.dajAktivnaPredavanja();
            req.predavanja = result.rows;
            next();
        } catch (err) {
            next(err);
        }
    },

    prikaziPredavanje: function (req, res, next) {
        res.render('publika/predavanje-pitanja',
            { title: 'Predavanje',
              naziv: req.predavanje.naziv,
              kod: req.predavanje.kod,
              traje_do: obradiDatum(req.predavanje.kdatum)
            });
    },


    dajPredavanja: async function (req, res, next) {
        try {
            const result = await predavanjeModel.dajPredavanja(req.user.id);
            req.predavanja = result.rows;
            next();
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    dajSvaPredavanja: async function (req, res, next) {
        try {
            const result = await predavanjeModel.dajSvaPredavanja();
            req.predavanja = result.rows;
            next();
        } catch (err) {
            next(err);
        }
    },

    prikaziPredavanja: function(req, res, next) {
        const trenutni_datum = new Date();
        var zavrsena_predavanja = [], aktivna_predavanja = [];
        for (let i = 0; i < req.predavanja.length; i++) {
            if (trenutni_datum.getTime() > req.predavanja[i].kdatum) {
                zavrsena_predavanja.push(req.predavanja[i]);
            } else {
                aktivna_predavanja.push(req.predavanja[i]);
            }
        }
        const niz_datuma_zavrsenih_predavanja = obradiDatume(zavrsena_predavanja);
        const niz_datuma_aktivnih_predavanja = obradiDatume(aktivna_predavanja);
        res.render('predavac/pocetna', {
            title: 'Slido', zavrsena_predavanja, aktivna_predavanja, niz_datuma_zavrsenih_predavanja,
            niz_datuma_aktivnih_predavanja, datum, user: req.user
        });
    },

    spremiPredavanje: async function (req, res, next) {
        const pitanja = (req.body.pitanja !== undefined) ? true : false;
        const putanjaSlike = (!req.file) ? "no" : req.file.path;
        const buf = crypto.randomBytes(4);
        const kod = buf.readUInt32BE(0);
        res.locals.redirect = `/pocetna`;

        try {
            await predavanjeModel.spremiPredavanje(kod.toString(), req.body.naziv, req.body.vrijeme, req.body.ponavljanje,
                                                                  putanjaSlike, req.body.kdatum, req.user.id, pitanja);
            next();
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    uploadSlika: upload.single('slika'),

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },

    uredi: async function (req, res, next) {
        res.locals.redirect = `/pocetna/predavanje-info/${req.body.kod}`;
      try {
          const result = await predavanjeModel.urediPredavanje(req.body.id, req.body.kod, req.body.naziv, req.body.vrijeme,
              req.body.ponavljanje, req.body.kdatum);
          req.predavanje = result.rows[0];
          next();
      } catch (err) {
          console.log(err);
          next(err);
      }
    },

    prikaziInfoPredavanja: {},

    generisiQR: function(req, res, next) {
        if(!io) {
            io = require('socket.io')(req.connection.server);

            io.sockets.on('connection', function (client) {
                client.emit('sve_poruke', poruke.toString());

                client.on('disconnect', function () {
                    console.log("disconnected event");
                });

                client.on('poruka_sa_servera', function (data) {
                    poruke.push(data);
                    io.emit('poruka_sa_servera2', data);
                });
            });
        }
        QRCode.toDataURL(`http://127.0.0.1:3000/predavanje/pitanja?kod=${req.params.kod}`, (err, src) => {
            if (err) res.send("Something went wrong!!");
            res.render('predavac/pristupni-kod', {
                title: 'Slido', kod: req.params.kod,
                QRkod: src,
                pitanja: req.pitanja
            });
        });
    },
    prikaziStatistikuPredavanja: function (req, res, next) {
        res.render('predavac/statistika-predavanja', { title: 'Slido', info: req.predavanja, user: req.user});
    },
    posaljiIzvjestaj: function (req, res, next) {
        let tekst = 'Pitanja i broj odobravanja: \n';
        for(let i = 0; i < req.pitanja.length; i++) {
            tekst += req.pitanja[i].tekst;
            tekst += ':\t';
            tekst += req.pitanja[i].lajkovi;
            tekst += '\n';
        }
        tekst += `Ukupan broj postavljenih pitanja je ${req.ukupanBrojPitanja}.
                  Broj odgovorenih pitanja je ${req.brojOdgovorenihPitanja}.`;


        const mailOptions = {
            from: process.env['EMAIL'],
            to: [ req.user.email ], // todo: ovdje treba bit req.user.email
            subject: `Izvještaj o predavanju ${req.predavanje.naziv}`,
            text: tekst
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log(`Email sent: ${info.response}`);
            }
        });
        res.json({kaj: "uspjesno"});
    },

    posaljiEmailove:  function (req,res, next) {
        const emailovi = req.body.emailovi.split(' ')
        const mailOptions = {
            from: process.env['EMAIL'],
            to: emailovi,
            subject: 'Pristupni link',
            text: `Poštovani,\nImate poziv za prisustvo predavanju.
            Možete se pridružiti putem sljedećeg linka http://localhost:3000/predavanje/pitanja/${req.body.kod} ili unosom koda ${req.body.kod} na http://localhost:3000`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log(`Email sent: ${info.response}`);
            }
        });
        res.json({kaj: "uspjesno"});
    },

    obrisiPredavanje: async function (req, res, next) {
        try {
            await predavanjeModel.obrisiPredavanje(req.params.id);
            next();
        } catch (err) {
            next(err)
        }
    },

    urediSliku: async function (req, res, next) {
        try {
            const putanjaSlike = (!req.file) ? "no" : req.file.path;
            await predavanjeModel.urediSliku(req.body.id, putanjaSlike);
            next();
        } catch (err) {
            next(err)
        }
    }
}