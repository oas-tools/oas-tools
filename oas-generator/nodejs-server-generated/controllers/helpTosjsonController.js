'use strict'

var helpTosjsonController = require('./helpTosjsonControllerService');

module.exports.helpTos = function helpTos(req, res, next) {
  helpTosjsonController.helpTos(req.swagger.params, res, next);
};

module.exports.helpTosJsonPARAMETERS = function helpTosJsonPARAMETERS(req, res, next) {
  helpTosjsonController.helpTosJsonPARAMETERS(req.swagger.params, res, next);
};