const express = require('express');
const router = express.Router();
const predavacKontroler = require('../controllers/predavac');
const predavanjeKontroler = require('../controllers/predavanje');
const pitanjaKontroler = require('../controllers/pitanje');
const zabranjeneRijeciKontroler = require('../controllers/zabranjene-rijeci');
let moment = require('moment');

router.get('/', predavacKontroler.provjeriAutentifikacijuAdmina, predavacKontroler.statistikaAdmin);

router.get('/predavaci', predavacKontroler.provjeriAutentifikacijuAdmina, predavacKontroler.dajPredavace,
    predavacKontroler.prikaziPredavace);

router.put('/obrisi-predavaca/:id', predavacKontroler.provjeriAutentifikacijuAdmina, predavacKontroler.obrisiPredavaca, function(req, res, next) {
  res.json({id: req.params.id});
});

router.put('/blokiraj-predavaca/:id', predavacKontroler.provjeriAutentifikacijuAdmina, predavacKontroler.blokirajPredavaca, function(req, res, next) {
  res.json({id: req.params.id});
});

router.get('/predavanja', predavacKontroler.provjeriAutentifikacijuAdmina, predavanjeKontroler.dajAktivnaPredavanja, function (req, res, next) {
  res.render('administrator/predavanja', { title: 'Predavanja', predavanja: req.predavanja, moment })
});

router.put('/obrisi-predavanje/:id', predavacKontroler.provjeriAutentifikacijuAdmina, predavanjeKontroler.obrisiPredavanje, function (req, res, next) {
  res.json({id: req.params.id});
});

router.get('/pitanja', predavacKontroler.provjeriAutentifikacijuAdmina, pitanjaKontroler.dajPitanjaIPredavanja, function (req, res, next) {
  res.render('administrator/pitanja', { title: 'Pitanja', pitanja: req.pitanja, moment})
});

router.put('/obrisi-pitanje/:id', predavacKontroler.provjeriAutentifikacijuAdmina, pitanjaKontroler.obrisiPitanje, function (req, res, next) {
  res.json({id: req.params.id});
});

router.get('/zabranjene-rijeci', predavacKontroler.provjeriAutentifikacijuAdmina, zabranjeneRijeciKontroler.dajZabranjeneRijeci, function (req, res, next) {
  res.render('administrator/zabranjene-rijeci', { title: 'Zabranjene rijeci', rijeci: req.zabranjene_rijeci});
});

router.post('/dodaj-rijec', predavacKontroler.provjeriAutentifikacijuAdmina, zabranjeneRijeciKontroler.dodajZabranjenuRijec, function (req, res, next) {
  console.log(req.body.broj);
  res.render('administrator/rijec', { rijec: req.zabranjena_rijec, broj: req.body.broj });
});

router.put('/obrisi-rijec/:id', predavacKontroler.provjeriAutentifikacijuAdmina, zabranjeneRijeciKontroler.obrisiZabranjenuRijec, function (req, res, next) {
  res.json({id: req.params.id});
});

router.put('/uredi-rijec/:id', predavacKontroler.provjeriAutentifikacijuAdmina, zabranjeneRijeciKontroler.urediZabranjenuRijec, function (req, res, next) {
  res.json({rijec: req.zabranjena_rijec});
});

module.exports = router;
