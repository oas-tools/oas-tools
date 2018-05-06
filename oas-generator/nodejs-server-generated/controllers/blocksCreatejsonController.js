'use strict'

var blocksCreatejsonController = require('./blocksCreatejsonControllerService');

module.exports.blocksCreateJsonPARAMETERS = function blocksCreateJsonPARAMETERS(req, res, next) {
  blocksCreatejsonController.blocksCreateJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.blocksCreate = function blocksCreate(req, res, next) {
  blocksCreatejsonController.blocksCreate(req.swagger.params, res, next);
};