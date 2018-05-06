'use strict'

var geoSearchjsonController = require('./geoSearchjsonControllerService');

module.exports.geoSearch = function geoSearch(req, res, next) {
  geoSearchjsonController.geoSearch(req.swagger.params, res, next);
};

module.exports.geoSearchJsonPARAMETERS = function geoSearchJsonPARAMETERS(req, res, next) {
  geoSearchjsonController.geoSearchJsonPARAMETERS(req.swagger.params, res, next);
};