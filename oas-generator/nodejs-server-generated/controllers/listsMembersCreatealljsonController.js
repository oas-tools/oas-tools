'use strict'

var listsMembersCreatealljsonController = require('./listsMembersCreatealljsonControllerService');

module.exports.listsMembersCreate_allJsonPARAMETERS = function listsMembersCreate_allJsonPARAMETERS(req, res, next) {
  listsMembersCreatealljsonController.listsMembersCreate_allJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.listsMembersCreate_all = function listsMembersCreate_all(req, res, next) {
  listsMembersCreatealljsonController.listsMembersCreate_all(req.swagger.params, res, next);
};