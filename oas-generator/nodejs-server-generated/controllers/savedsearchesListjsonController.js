'use strict'

var savedsearchesListjsonController = require('./savedsearchesListjsonControllerService');

module.exports.saved_searchesList = function saved_searchesList(req, res, next) {
  savedsearchesListjsonController.saved_searchesList(req.swagger.params, res, next);
};

module.exports.saved_searchesListJsonPARAMETERS = function saved_searchesListJsonPARAMETERS(req, res, next) {
  savedsearchesListjsonController.saved_searchesListJsonPARAMETERS(req.swagger.params, res, next);
};