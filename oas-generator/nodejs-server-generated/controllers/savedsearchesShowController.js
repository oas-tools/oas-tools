'use strict'

var savedsearchesShowController = require('./savedsearchesShowControllerService');

module.exports.savedsearchesid = function savedsearchesid(req, res, next) {
  savedsearchesShowController.savedsearchesid(req.swagger.params, res, next);
};

module.exports.saved_searchesShowIdJsonPARAMETERS = function saved_searchesShowIdJsonPARAMETERS(req, res, next) {
  savedsearchesShowController.saved_searchesShowIdJsonPARAMETERS(req.swagger.params, res, next);
};