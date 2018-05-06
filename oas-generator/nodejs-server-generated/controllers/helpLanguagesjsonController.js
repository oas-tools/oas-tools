'use strict'

var helpLanguagesjsonController = require('./helpLanguagesjsonControllerService');

module.exports.helpLanguages = function helpLanguages(req, res, next) {
  helpLanguagesjsonController.helpLanguages(req.swagger.params, res, next);
};

module.exports.helpLanguagesJsonPARAMETERS = function helpLanguagesJsonPARAMETERS(req, res, next) {
  helpLanguagesjsonController.helpLanguagesJsonPARAMETERS(req.swagger.params, res, next);
};