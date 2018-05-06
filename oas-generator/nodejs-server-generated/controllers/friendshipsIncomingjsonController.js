'use strict'

var friendshipsIncomingjsonController = require('./friendshipsIncomingjsonControllerService');

module.exports.friendshipsIncoming = function friendshipsIncoming(req, res, next) {
  friendshipsIncomingjsonController.friendshipsIncoming(req.swagger.params, res, next);
};

module.exports.friendshipsIncomingJsonPARAMETERS = function friendshipsIncomingJsonPARAMETERS(req, res, next) {
  friendshipsIncomingjsonController.friendshipsIncomingJsonPARAMETERS(req.swagger.params, res, next);
};