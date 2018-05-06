'use strict'

var listsMembersShowjsonController = require('./listsMembersShowjsonControllerService');

module.exports.listsMembersShow = function listsMembersShow(req, res, next) {
  listsMembersShowjsonController.listsMembersShow(req.swagger.params, res, next);
};

module.exports.listsMembersShowJsonPARAMETERS = function listsMembersShowJsonPARAMETERS(req, res, next) {
  listsMembersShowjsonController.listsMembersShowJsonPARAMETERS(req.swagger.params, res, next);
};