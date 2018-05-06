'use strict'

var favoritesDestroyjsonController = require('./favoritesDestroyjsonControllerService');

module.exports.favoritesDestroyJsonPARAMETERS = function favoritesDestroyJsonPARAMETERS(req, res, next) {
  favoritesDestroyjsonController.favoritesDestroyJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.favoritesDestroy = function favoritesDestroy(req, res, next) {
  favoritesDestroyjsonController.favoritesDestroy(req.swagger.params, res, next);
};