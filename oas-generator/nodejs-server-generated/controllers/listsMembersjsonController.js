'use strict'

var listsMembersjsonController = require('./listsMembersjsonControllerService');

module.exports.listsMembers = function listsMembers(req, res, next) {
  listsMembersjsonController.listsMembers(req.swagger.params, res, next);
};

module.exports.listsMembersJsonPARAMETERS = function listsMembersJsonPARAMETERS(req, res, next) {
  listsMembersjsonController.listsMembersJsonPARAMETERS(req.swagger.params, res, next);
};