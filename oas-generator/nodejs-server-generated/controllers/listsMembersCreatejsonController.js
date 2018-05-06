'use strict'

var listsMembersCreatejsonController = require('./listsMembersCreatejsonControllerService');

module.exports.listsMembersCreateJsonPARAMETERS = function listsMembersCreateJsonPARAMETERS(req, res, next) {
  listsMembersCreatejsonController.listsMembersCreateJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.listsMembersCreate = function listsMembersCreate(req, res, next) {
  listsMembersCreatejsonController.listsMembersCreate(req.swagger.params, res, next);
};