'use strict'

var listsCreatejsonController = require('./listsCreatejsonControllerService');

module.exports.listsCreateJsonPARAMETERS = function listsCreateJsonPARAMETERS(req, res, next) {
  listsCreatejsonController.listsCreateJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.listsCreate = function listsCreate(req, res, next) {
  listsCreatejsonController.listsCreate(req.swagger.params, res, next);
};