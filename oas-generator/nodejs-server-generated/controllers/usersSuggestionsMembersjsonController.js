'use strict'

var usersSuggestionsMembersjsonController = require('./usersSuggestionsMembersjsonControllerService');

module.exports.usersSuggestionsslugmembers = function usersSuggestionsslugmembers(req, res, next) {
  usersSuggestionsMembersjsonController.usersSuggestionsslugmembers(req.swagger.params, res, next);
};

module.exports.usersSuggestionsSlugMembersJsonPARAMETERS = function usersSuggestionsSlugMembersJsonPARAMETERS(req, res, next) {
  usersSuggestionsMembersjsonController.usersSuggestionsSlugMembersJsonPARAMETERS(req.swagger.params, res, next);
};