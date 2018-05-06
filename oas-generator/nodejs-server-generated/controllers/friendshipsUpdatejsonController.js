'use strict'

var friendshipsUpdatejsonController = require('./friendshipsUpdatejsonControllerService');

module.exports.friendshipsUpdateJsonPARAMETERS = function friendshipsUpdateJsonPARAMETERS(req, res, next) {
  friendshipsUpdatejsonController.friendshipsUpdateJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.friendshipsUpdate = function friendshipsUpdate(req, res, next) {
  friendshipsUpdatejsonController.friendshipsUpdate(req.swagger.params, res, next);
};