const pool = require('../db');
const pitanjaModel = require('../models/pitanje');
const predavanjeModel = require("../models/predavanje");
const zabranjeneRijeciModel = require('../models/zabranjene-rijeci');
let moment = require('moment');
var io = null;

function obradiDatumZaHtml(datum) {
    const mjesec = (datum.getMonth() + 1 < 10) ? "0" + String(datum.getMonth() + 1) : String(datum.getMonth() + 1);
    const dan = (datum.getDate() < 10) ? "0" + String(datum.getDate()) : String(datum.getDate());
    return String(datum.getFullYear()) + "-" + mjesec + "-" + dan;
}

function zabranjena(rijeci, pitanje) {
    for (let i = 0; i < rijeci.length; i++) {
        for (let j = 0; j < pitanje.length; j++) {
            console.log(rijeci[i].rijec.toLowerCase() + '--' + pitanje[j].toLowerCase());
            if (rijeci[i].rijec.toLowerCase() === pitanje[j].toLowerCase()) {
                return true;
            }
        }
    }
    return false;
}

module.exports = {
    dajPitanja: async function (req, res, next) {
        try {
            const result = await pitanjaModel.dajPitanja(req.predavanje.id);
            req.pitanja = result.rows;
            next();
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    dajPitanjaPublici: async function (req, res, next) {
        try {
            const result = await pitanjaModel.dajPitanjaPublici(req.predavanje.id);
            req.pitanja = result.rows;
            console.log(result.rows)
            next();
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    dodajPitanje: async function (req, res, next, data) {
        try {
            const result = await pitanjaModel.dodajPitanje(data, req.predavanje.id);

            next();
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    socketi: function (req, res, next) {
        if (!io) {
            io = require('socket.io')(req.connection.server);
            io.sockets.on('connection', async client => {
                client.on('create', room => {
                    console.log('bla', room)
                    client.join(room);
                });
                client.on('disconnect', () => {
                    console.log('disconnected1');
                });
                client.on('send-chat-message', async (room, data) => {
                    let pitanjeId;
                    console.log('ovdje', room, data);
                    const zabranjene_rijeci = await zabranjeneRijeciModel.dajZabranjeneRijeci();
                    const rijeci = zabranjene_rijeci.rows;
                    const pitanje = data.split(' ');
                    try {
                        let result;
                        if(zabranjena(rijeci, pitanje)) {
                            result = await pitanjaModel.spremiPitanje(data, req.predavanje.id, true);
                            pitanjeId = result.rows[0].id;
                            io.to(room).emit('zabranjena-rijec', data, pitanjeId);
                        } else {
                            result = await pitanjaModel.spremiPitanje(data, req.predavanje.id, false);
                            pitanjeId = result.rows[0].id;
                            io.to(room).emit('chat-message', data, pitanjeId);
                        }
                    } catch (err) {
                        console.log(err);
                    }
                });
                client.on('povecaj_lajkove', async function (id, lajkovi) {
                    lajkovi++;
                    console.log('lajkam' ,lajkovi);
                    await pool.connect(async function (err, client, done) {
                        if (err) {
                            return res.send(err);
                        }
                        await client.query(`UPDATE pitanja SET lajkovi = $1 WHERE id = $2`, [ lajkovi, id ],
                            function (err) {
                                done();
                                if (err) {
                                    console.log(err);
                                }
                            });
                    });
                    io.emit('promjena_lajkova', id, lajkovi);
                });
                client.on('dislike', async function (id, lajkovi) {
                    lajkovi--;
                    console.log(lajkovi);
                    await pool.connect(async function (err, client, done) {
                        if (err) {
                            return res.send(err);
                        }
                        await client.query(`UPDATE pitanja SET lajkovi = $1 WHERE id = $2`, [ lajkovi, id ],
                            function (err) {
                                done();
                                if (err) {
                                    console.log(err);
                                }
                            });
                    });
                    io.emit('promjena_lajkova', id, lajkovi);
                });
                client.on('obrisi-pitanje-publici', function(id, room) {
                    io.to(room).emit('brisanje-pitanja', id);
                });
                client.on('prikazi-pitanje-publici', async function(id, room) {
                     let pitanje;
                    try {
                        const result = await pitanjaModel.dajPitanje(id);
                        console.log('tekst pitanja', result.rows);
                        pitanje = result.rows[0].tekst;
                        console.log(pitanje)
                    } catch (err) {
                        console.log(err);
                    }
                    io.to(room).emit('prikaz-pitanja', pitanje, id);
                });
            });
        }

        if (req.isAuthenticated()) {
            const datum = new Date();
            res.render('predavac/predavanje-info',
                {
                    title: 'Slido',
                    id: req.predavanje.id,
                    kod: req.predavanje.kod,
                    predavanje: req.predavanje,
                    pitanja: req.pitanja,
                    moment,
                    user: req.user,
                    kdatum: obradiDatumZaHtml(req.predavanje.kdatum),
                    datum: obradiDatumZaHtml(datum)
                });
        }
        else {
            res.render('publika/predavanje-pitanja',
                {
                    title: 'Predavanje',
                    naziv: req.predavanje.naziv,
                    kod: req.predavanje.kod,
                    predavanje: req.predavanje,
                    pitanja: req.pitanja,
                    moment
                });
        }
    },
    odgovoriPitanje: async function (req, res, next) {
        try {
            await pitanjaModel.odgovorenoPitanje(req.params.id);
            res.json({message: 'Data updated successfully'});
        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Error updating data'});
            next(err);
        }
    },

    dodajBrojPitanja: async function (req, res, next) {
        try {
            for (let i = 0; i < req.predavanja.length; i++) {
                const result1 = await pitanjaModel.prebrojPitanjaNekogPredavanja(req.predavanja[i].id);
                req.predavanja[i].broj_pitanja = result1.rows[0].broj;

                const result2 = await pitanjaModel.prebrojOdgovorenaPitanjaNekogPredavanja(req.predavanja[i].id);
                req.predavanja[i].broj_odgovorenih_pitanja = result2.rows[0].broj;

            }
            next();
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    sakrijPitanje: async function (req, res, next) {
        try {
            const result = await pitanjaModel.sakrijPitanje(req.params.id);
            req.sakrivenoPitanje = result.rows[0];
            console.log(result);
            next();
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    otkrijPitanje: async function (req, res, next) {
        try {
            const result = await pitanjaModel.otkrijPitanje(req.params.id);
            req.otkrivenoPitanje = result.rows[0];
            console.log(result);
            next();
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    obrisiPitanje: async function (req, res, next) {
        try {
            console.log('ovdje sam', req.params.id);
            await pitanjaModel.obrisiPitanje(req.params.id);
            next();
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

    sortiraj: async function (req, res, next) {
        switch (req.query.tip) {
            case '1':
                try {
                    const result = await pitanjaModel.dajPitanjaPoLajkovimaAsc(req.query.id);
                    req.pitanja = result.rows;
                    next();
                } catch (err) {
                    console.log(err);
                    next(err);
                }
                break;
            case '2':
                try {
                    const result = await pitanjaModel.dajPitanjaPoLajkovimaDesc(req.query.id);
                    req.pitanja = result.rows;
                    console.log(result);
                    next();
                } catch (err) {
                    console.log(err);
                    next(err);
                }
                break;
            case '3':
                try {
                    const result = await pitanjaModel.dajPitanjaPoVremenuAsc(req.query.id);
                    req.pitanja = result.rows;
                    next();
                } catch (err) {
                    console.log(err);
                    next(err);
                }
                break;
            default:
                try {
                    const result = await pitanjaModel.dajPitanjaPoVremenuDesc(req.query.id);
                    req.pitanja = result.rows;
                    next();
                } catch (err) {
                    console.log(err);
                    next(err);
                }
        }
    },

    prebrojPitanja: async function (req, res, next) {
        console.log(req.predavanje.id)
        try{
            const result = await pitanjaModel.prebrojPitanjaNekogPredavanja(req.predavanje.id);
            req.ukupanBrojPitanja = result.rows[0].broj;
            console.log(result.rows[0]);
            next();
        } catch (err) {
            console.log(err);
            next(err)
        }
    },

    prebrojOdgovorenaPitanja: async function (req, res, next) {
        console.log(req.predavanje.id)
        try{
            const result = await pitanjaModel.prebrojOdgovorenaPitanjaNekogPredavanja(req.predavanje.id);
            req.brojOdgovorenihPitanja = result.rows[0].broj;
            console.log(result.rows[0]);
            next();
        } catch (err) {
            console.log(err);
            next(err)
        }
    },

    prikaziSpisakPitanjaPredavacu: function (req, res, next) {
        res.render('predavac/spisak-pitanja', { pitanja: req.pitanja })
    },

    prikaziSpisakPitanjaPublici: function (req, res, next) {
        res.render('publika/spisak-pitanja', { pitanja: req.pitanja })
    },

    dajPitanjaIPredavanja: async function (req, res, next) {
        try {
            const result = await pitanjaModel.dajPitanjaIPredavanja();
            req.pitanja = result.rows;
            console.log(result.rows);
            next();
        } catch (err) {
            next(err);
        }
    }
}