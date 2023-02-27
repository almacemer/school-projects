const express = require('express');
const router = express.Router();
const predavacKontroler = require('../controllers/predavac');

router.get('/', predavacKontroler.provjeriNeAutentifikaciju, function(req, res, next) {
  res.render('index', { naslov: 'Slido', kod_nije_validan: '' });
});

module.exports = router;
