'use strict'

var listsDestroyjsonController = require('./listsDestroyjsonControllerService');

module.exports.listsDestroyJsonPARAMETERS = function listsDestroyJsonPARAMETERS(req, res, next) {
  listsDestroyjsonController.listsDestroyJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.listsDestroy = function listsDestroy(req, res, next) {
  listsDestroyjsonController.listsDestroy(req.swagger.params, res, next);
};