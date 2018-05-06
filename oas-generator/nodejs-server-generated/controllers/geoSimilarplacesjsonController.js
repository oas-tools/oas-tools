'use strict'

var geoSimilarplacesjsonController = require('./geoSimilarplacesjsonControllerService');

module.exports.geoSimilar_places = function geoSimilar_places(req, res, next) {
  geoSimilarplacesjsonController.geoSimilar_places(req.swagger.params, res, next);
};

module.exports.geoSimilar_placesJsonPARAMETERS = function geoSimilar_placesJsonPARAMETERS(req, res, next) {
  geoSimilarplacesjsonController.geoSimilar_placesJsonPARAMETERS(req.swagger.params, res, next);
};