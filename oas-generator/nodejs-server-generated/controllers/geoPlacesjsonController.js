'use strict'

var geoPlacesjsonController = require('./geoPlacesjsonControllerService');

module.exports.geoPlacesJsonPARAMETERS = function geoPlacesJsonPARAMETERS(req, res, next) {
  geoPlacesjsonController.geoPlacesJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.geoPlaces = function geoPlaces(req, res, next) {
  geoPlacesjsonController.geoPlaces(req.swagger.params, res, next);
};