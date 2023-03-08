var express = require('express');
var router = express.Router();
var moment = require('moment');
const nodemailer = require('nodemailer');

const usersController = require('../controllers/usersController');
const viewersController = require('../controllers/viewersController');

router.get('/', usersController.notAuth, function(req, res, next) {
  res.render('index', { title1: 'DSE', title2: 'Discover Sarajevo Events', moment: moment });
});

router.get('/login', usersController.notAuth, function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/event/:id/map', viewersController.getEventsIDS, function(req, res, next) {
  res.render('map', { title: 'Map', event_details: req.events });
});

router.get('/events/:type', viewersController.getEvents, function(req, res, next) {
  res.render('events', { title: req.params.type, events: req.events, moment: moment, key: process.env['GOOGLE_MAPS_API_KEY'] });
});


router.post('/events/reservation', viewersController.saveReservation, function (req, res, next) {
  const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: process.env['EMAIL'],
      pass: process.env['EMAIL_PASSWORD']
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: process.env['EMAIL'],
    to: req.body.email,
    subject: 'Success reservation!',
    text: 'Your reservation was successful, you can show this mail as a confirmation.'
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });

  res.redirect('/');
});

module.exports = router;
