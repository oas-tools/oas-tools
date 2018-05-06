'use strict'

var listsShowjsonController = require('./listsShowjsonControllerService');

module.exports.listsShow = function listsShow(req, res, next) {
  listsShowjsonController.listsShow(req.swagger.params, res, next);
};

module.exports.listsShowJsonPARAMETERS = function listsShowJsonPARAMETERS(req, res, next) {
  listsShowjsonController.listsShowJsonPARAMETERS(req.swagger.params, res, next);
};