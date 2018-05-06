'use strict'

var geoReversegeocodejsonController = require('./geoReversegeocodejsonControllerService');

module.exports.geoReverse_geocode = function geoReverse_geocode(req, res, next) {
  geoReversegeocodejsonController.geoReverse_geocode(req.swagger.params, res, next);
};

module.exports.geoReverse_geocodeJsonPARAMETERS = function geoReverse_geocodeJsonPARAMETERS(req, res, next) {
  geoReversegeocodejsonController.geoReverse_geocodeJsonPARAMETERS(req.swagger.params, res, next);
};