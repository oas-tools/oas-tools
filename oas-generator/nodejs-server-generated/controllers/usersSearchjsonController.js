'use strict'

var usersSearchjsonController = require('./usersSearchjsonControllerService');

module.exports.usersSearch = function usersSearch(req, res, next) {
  usersSearchjsonController.usersSearch(req.swagger.params, res, next);
};

module.exports.usersSearchJsonPARAMETERS = function usersSearchJsonPARAMETERS(req, res, next) {
  usersSearchjsonController.usersSearchJsonPARAMETERS(req.swagger.params, res, next);
};