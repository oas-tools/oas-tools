'use strict'

var friendshipsDestroyjsonController = require('./friendshipsDestroyjsonControllerService');

module.exports.friendshipsDestroyJsonPARAMETERS = function friendshipsDestroyJsonPARAMETERS(req, res, next) {
  friendshipsDestroyjsonController.friendshipsDestroyJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.friendshipsDestroy = function friendshipsDestroy(req, res, next) {
  friendshipsDestroyjsonController.friendshipsDestroy(req.swagger.params, res, next);
};