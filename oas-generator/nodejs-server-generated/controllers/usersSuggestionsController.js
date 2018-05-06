'use strict'

var usersSuggestionsController = require('./usersSuggestionsControllerService');

module.exports.usersSuggestionsSlug = function usersSuggestionsSlug(req, res, next) {
  usersSuggestionsController.usersSuggestionsSlug(req.swagger.params, res, next);
};

module.exports.usersSuggestionsSlugJsonPARAMETERS = function usersSuggestionsSlugJsonPARAMETERS(req, res, next) {
  usersSuggestionsController.usersSuggestionsSlugJsonPARAMETERS(req.swagger.params, res, next);
};