'use strict'

var statusesUpdatejsonController = require('./statusesUpdatejsonControllerService');

module.exports.statusesUpdateJsonPARAMETERS = function statusesUpdateJsonPARAMETERS(req, res, next) {
  statusesUpdatejsonController.statusesUpdateJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.statusesUpdate = function statusesUpdate(req, res, next) {
  statusesUpdatejsonController.statusesUpdate(req.swagger.params, res, next);
};