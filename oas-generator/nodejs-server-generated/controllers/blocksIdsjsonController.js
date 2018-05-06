'use strict'

var blocksIdsjsonController = require('./blocksIdsjsonControllerService');

module.exports.blocksIds = function blocksIds(req, res, next) {
  blocksIdsjsonController.blocksIds(req.swagger.params, res, next);
};

module.exports.blocksIdsJsonPARAMETERS = function blocksIdsJsonPARAMETERS(req, res, next) {
  blocksIdsjsonController.blocksIdsJsonPARAMETERS(req.swagger.params, res, next);
};