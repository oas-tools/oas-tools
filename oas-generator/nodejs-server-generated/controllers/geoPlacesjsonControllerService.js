'use strict'

module.exports.geoPlacesJsonPARAMETERS = function geoPlacesJsonPARAMETERS(req, res, next) {
  res.send({
    message: 'This is the raw controller for geoPlacesJsonPARAMETERS'
  });
};

module.exports.geoPlaces = function geoPlaces(req, res, next) {
  res.send({
    message: 'This is the raw controller for geoPlaces'
  });
};