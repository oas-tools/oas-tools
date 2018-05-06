'use strict'

var friendshipsShowjsonController = require('./friendshipsShowjsonControllerService');

module.exports.friendshipsShow = function friendshipsShow(req, res, next) {
  friendshipsShowjsonController.friendshipsShow(req.swagger.params, res, next);
};

module.exports.friendshipsShowJsonPARAMETERS = function friendshipsShowJsonPARAMETERS(req, res, next) {
  friendshipsShowjsonController.friendshipsShowJsonPARAMETERS(req.swagger.params, res, next);
};