var express = require('express');
var router = express.Router();
var moment = require('moment');

const usersController = require('../controllers/usersController');

router.get('/', usersController.authUser, usersController.getEvents, function(req, res, next) {
    res.render('user-panel', { title: 'User', events_details: req.events_details, moment: moment });
});

router.post('/create_event', usersController.authUser, usersController.insertEvent, function(req, res, next) {
    res.redirect('/');
});

router.get('/event/:id', usersController.authUser, usersController.getEvent, function(req, res, next) {
    res.render('user-event', { title: req.event_details.title, event_details: req.event_details, moment: moment, key: process.env['GOOGLE_MAPS_API_KEY'] });
});

module.exports = router;
