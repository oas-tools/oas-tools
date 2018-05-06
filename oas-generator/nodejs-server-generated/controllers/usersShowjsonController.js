'use strict'

var usersShowjsonController = require('./usersShowjsonControllerService');

module.exports.usersShow = function usersShow(req, res, next) {
  usersShowjsonController.usersShow(req.swagger.params, res, next);
};

module.exports.usersShowJsonPARAMETERS = function usersShowJsonPARAMETERS(req, res, next) {
  usersShowjsonController.usersShowJsonPARAMETERS(req.swagger.params, res, next);
};