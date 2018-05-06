'use strict'

var blocksListjsonController = require('./blocksListjsonControllerService');

module.exports.blocksList = function blocksList(req, res, next) {
  blocksListjsonController.blocksList(req.swagger.params, res, next);
};

module.exports.blocksListJsonPARAMETERS = function blocksListJsonPARAMETERS(req, res, next) {
  blocksListjsonController.blocksListJsonPARAMETERS(req.swagger.params, res, next);
};