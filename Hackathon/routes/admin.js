var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');
const adminController = require('../controllers/adminController');
var moment = require('moment');

router.get('/', usersController.authAdmin, usersController.decide, adminController.getEvents, function(req, res, next) {
    res.render('admin-panel', { title: 'Events', events_details: req.events, moment: moment });
});

router.get('/approved_events', usersController.authAdmin, adminController.getApprovedEvents, function(req, res, next) {
    res.render('admin-approved_events', { title: 'Approved events', approved_events: req.approved_events, moment: moment });
});

router.get('/users', usersController.authAdmin,  adminController.getUsers, function(req, res, next) {
    res.render('admin-users', { title: 'Users', users: req.users });
});

router.put('/users/delete', adminController.editUser, function (req, res, next){
    res.json({id: req.body.id});
});

router.put('/users/approve', adminController.editApprovementEvent, function (req, res, next) {
    res.json({ id: req.body.id });
});

router.put('/users/decline', adminController.editDeclinedEvent, function (req, res, next) {
    res.json({ id: req.body.id });
});



module.exports = router;