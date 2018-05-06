'use strict'

var statusesDestroyController = require('./statusesDestroyControllerService');

module.exports.statusesDestroyIdJsonPARAMETERS = function statusesDestroyIdJsonPARAMETERS(req, res, next) {
  statusesDestroyController.statusesDestroyIdJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.statusesDestroy = function statusesDestroy(req, res, next) {
  statusesDestroyController.statusesDestroy(req.swagger.params, res, next);
};