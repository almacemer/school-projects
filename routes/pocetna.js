const express = require('express');
const router = express.Router();
const predavacKontroler = require('../controllers/predavac');
const predavanjeKontroler = require('../controllers/predavanje');
const pitanjeKontroler = require('../controllers/pitanje');
const nodemailer = require('nodemailer');

router.get('/', predavacKontroler.provjeriAutentifikacijuPredavaca, predavanjeKontroler.dajPredavanja,
    predavanjeKontroler.prikaziPredavanja);

router.post('/', predavacKontroler.provjeriAutentifikacijuPredavaca, predavanjeKontroler.uploadSlika,
    predavanjeKontroler.spremiPredavanje, predavanjeKontroler.redirectView);

router.get('/statistika-predavanja', predavacKontroler.provjeriAutentifikacijuPredavaca, predavanjeKontroler.dajPredavanja,
    pitanjeKontroler.dodajBrojPitanja, predavanjeKontroler.prikaziStatistikuPredavanja)

router.get('/pristupni-kod/:kod', predavacKontroler.provjeriAutentifikacijuPredavaca,
    predavanjeKontroler.dajPredavanje, pitanjeKontroler.dajPitanja, predavanjeKontroler.generisiQR);

router.get('/predavanje-info/:kod', predavacKontroler.provjeriAutentifikacijuPredavaca, predavanjeKontroler.dajPredavanje,
    pitanjeKontroler.dajPitanja, pitanjeKontroler.socketi);

router.put('/predavanje-info/uredi', predavacKontroler.provjeriAutentifikacijuPredavaca, predavanjeKontroler.uredi,
    pitanjeKontroler.dajPitanja, function (req, res, next) {
        res.json(req.predavanje);
    });

router.post('/predavanje-info/uredi-sliku', predavacKontroler.provjeriAutentifikacijuPredavaca, predavanjeKontroler.uploadSlika,
    predavanjeKontroler.urediSliku, function (req, res, next) {
        res.redirect(`/pocetna/predavanje-info/${req.body.kod}`);
    });

router.put('/odgovori-pitanje/:id', predavacKontroler.provjeriAutentifikacijuPredavaca, pitanjeKontroler.odgovoriPitanje);

router.put('/sakrij-pitanje/:id', predavacKontroler.provjeriAutentifikacijuPredavaca, pitanjeKontroler.sakrijPitanje,
     function (req, res, next) {
        res.json(req.params.id);
    });

router.put('/obrisi-pitanje/:id', predavacKontroler.provjeriAutentifikacijuPredavaca, pitanjeKontroler.obrisiPitanje, function (req, res, next) {
        res.json(req.params.id);
    });

router.post('/posalji-izvjestaj', predavacKontroler.provjeriAutentifikacijuPredavaca, predavanjeKontroler.dajPredavanje,
    pitanjeKontroler.dajPitanja, pitanjeKontroler.prebrojPitanja, pitanjeKontroler.prebrojOdgovorenaPitanja,
    predavanjeKontroler.posaljiIzvjestaj)

router.post('/posalji-emailove', predavacKontroler.provjeriAutentifikacijuPredavaca, predavanjeKontroler.posaljiEmailove);

router.get('/sortiraj', predavacKontroler.provjeriAutentifikacijuPredavaca, pitanjeKontroler.sortiraj,
    pitanjeKontroler.prikaziSpisakPitanjaPredavacu);

router.put('/otkrij-pitanje/:id', predavacKontroler.provjeriAutentifikacijuPredavaca, pitanjeKontroler.otkrijPitanje,
    function (req, res, next) {
        res.json(req.params.id);
    });




module.exports = router;
