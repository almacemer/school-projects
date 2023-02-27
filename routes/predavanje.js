const express = require('express');
const router = express.Router();
const predavacKontroler = require('../controllers/predavac');
const predavanjeKontroler = require('../controllers/predavanje');
const pitanjeKontroler = require('../controllers/pitanje');

router.post('/pitanja', predavacKontroler.provjeriNeAutentifikaciju, function (req, res, next) {
        res.redirect(`/predavanje/pitanja/${req.body.kod}`);
    });

router.get('/pitanja/sortiraj', predavacKontroler.provjeriNeAutentifikaciju, pitanjeKontroler.sortiraj,
    pitanjeKontroler.prikaziSpisakPitanjaPublici)

router.get('/pitanja/:kod', predavacKontroler.provjeriNeAutentifikaciju, predavanjeKontroler.dajAktivnoPredavanje,
    pitanjeKontroler.dajPitanjaPublici, pitanjeKontroler.socketi);




module.exports = router;
