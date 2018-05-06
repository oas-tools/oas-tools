'use strict'

var listsUpdatejsonController = require('./listsUpdatejsonControllerService');

module.exports.listsUpdateJsonPARAMETERS = function listsUpdateJsonPARAMETERS(req, res, next) {
  listsUpdatejsonController.listsUpdateJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.listsUpdate = function listsUpdate(req, res, next) {
  listsUpdatejsonController.listsUpdate(req.swagger.params, res, next);
};