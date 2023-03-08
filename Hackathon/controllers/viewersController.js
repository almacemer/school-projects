const db = require('../models/viewersModel');
module.exports = {
    getEvents: (req, res, next) => {
        db.getEvents(req, res, next);
    },
    getEventsIDS: (req, res, next) => {
        db.getEventsIDS(req, res, next);
    },
    saveReservation: (req, res, next) => {
        db.saveReservation(req, res, next);
    }
}