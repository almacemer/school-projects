const db = require("../models/adminModel")
module.exports = {
    getUsers: (req, res, next) => {
        db.getUsers(req, res, next);
    },
    getEvents: (req, res, next) => {
        db.getEvents(req, res, next);
    },
    editApprovementEvent: (req, res, next) => {
        db.editApprovementEvent(req, res, next);
    },

    editDeclinedEvent: (req, res, next) => {
        db.editDeclinedEvent(req, res, next);
    },
    getApprovedEvents: (req, res, next) => {
        db.getApprovedEvents(req, res, next);
    },
    getDeclinedEvents: (req, res, next) => {
        db.getDeclinedEvents(req, res, next);
    },
    editUser: (req, res, next) => {
        db.editUser(req, res, next);
    }
}