'use strict'

var geoIdController = require('./geoIdControllerService');

module.exports.geoPlace_id = function geoPlace_id(req, res, next) {
  geoIdController.geoPlace_id(req.swagger.params, res, next);
};

module.exports.geoIdPlace_idJsonPARAMETERS = function geoIdPlace_idJsonPARAMETERS(req, res, next) {
  geoIdController.geoIdPlace_idJsonPARAMETERS(req.swagger.params, res, next);
};