'use strict'

var friendshipsCreatejsonController = require('./friendshipsCreatejsonControllerService');

module.exports.friendshipsCreateJsonPARAMETERS = function friendshipsCreateJsonPARAMETERS(req, res, next) {
  friendshipsCreatejsonController.friendshipsCreateJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.friendshipsCreate = function friendshipsCreate(req, res, next) {
  friendshipsCreatejsonController.friendshipsCreate(req.swagger.params, res, next);
};