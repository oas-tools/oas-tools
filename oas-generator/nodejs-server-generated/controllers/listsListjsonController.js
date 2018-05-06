'use strict'

var listsListjsonController = require('./listsListjsonControllerService');

module.exports.listsList = function listsList(req, res, next) {
  listsListjsonController.listsList(req.swagger.params, res, next);
};

module.exports.listsListJsonPARAMETERS = function listsListJsonPARAMETERS(req, res, next) {
  listsListjsonController.listsListJsonPARAMETERS(req.swagger.params, res, next);
};