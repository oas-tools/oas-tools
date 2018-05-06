'use strict'

var blocksDestroyjsonController = require('./blocksDestroyjsonControllerService');

module.exports.blocksDestroyJsonPARAMETERS = function blocksDestroyJsonPARAMETERS(req, res, next) {
  blocksDestroyjsonController.blocksDestroyJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.blocksDestroy = function blocksDestroy(req, res, next) {
  blocksDestroyjsonController.blocksDestroy(req.swagger.params, res, next);
};