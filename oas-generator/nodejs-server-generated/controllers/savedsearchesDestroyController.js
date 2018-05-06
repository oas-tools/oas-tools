'use strict'

var savedsearchesDestroyController = require('./savedsearchesDestroyControllerService');

module.exports.saved_searchesDestroyIdJsonPARAMETERS = function saved_searchesDestroyIdJsonPARAMETERS(req, res, next) {
  savedsearchesDestroyController.saved_searchesDestroyIdJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.saved_searchesDestroy = function saved_searchesDestroy(req, res, next) {
  savedsearchesDestroyController.saved_searchesDestroy(req.swagger.params, res, next);
};