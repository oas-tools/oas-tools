'use strict'

var listsMembershipsjsonController = require('./listsMembershipsjsonControllerService');

module.exports.listsMemberships = function listsMemberships(req, res, next) {
  listsMembershipsjsonController.listsMemberships(req.swagger.params, res, next);
};

module.exports.listsMembershipsJsonPARAMETERS = function listsMembershipsJsonPARAMETERS(req, res, next) {
  listsMembershipsjsonController.listsMembershipsJsonPARAMETERS(req.swagger.params, res, next);
};