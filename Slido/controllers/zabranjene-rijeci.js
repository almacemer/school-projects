const zabranjeneRijeciModel = require('../models/zabranjene-rijeci');

module.exports = {
    dajZabranjeneRijeci: async function (req, res, next) {
        try {
            const result = await zabranjeneRijeciModel.dajZabranjeneRijeci();
            req.zabranjene_rijeci = result.rows;
            console.log(result.rows);
            next();
        } catch (err) {
            next(err);
        }
    },
    dodajZabranjenuRijec: async function (req, res, next) {
        try {
            const result = await zabranjeneRijeciModel.dodajZabranjenuRijec(req.body.rijec);
            req.zabranjena_rijec = result.rows[0];
            console.log(result.rows);
            next();
        } catch (err) {
            next(err);
        }
    },
    urediZabranjenuRijec: async function (req, res, next) {
        try {
            const result = await zabranjeneRijeciModel.urediZabranjenuRijec(req.params.id, req.body.rijec);
            req.zabranjena_rijec = result.rows[0];
            console.log(result.rows);
            next();
        } catch (err) {
            next(err);
        }
    },
    obrisiZabranjenuRijec: async function (req, res, next) {
        try {
            await zabranjeneRijeciModel.obrisiZabranjenuRijec(req.params.id);
            next();
        } catch (err) {
            next(err);
        }
    }
}