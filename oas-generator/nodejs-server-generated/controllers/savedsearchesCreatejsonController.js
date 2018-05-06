'use strict'

var savedsearchesCreatejsonController = require('./savedsearchesCreatejsonControllerService');

module.exports.saved_searchesCreateJsonPARAMETERS = function saved_searchesCreateJsonPARAMETERS(req, res, next) {
  savedsearchesCreatejsonController.saved_searchesCreateJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.saved_searchesCreate = function saved_searchesCreate(req, res, next) {
  savedsearchesCreatejsonController.saved_searchesCreate(req.swagger.params, res, next);
};