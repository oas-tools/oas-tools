'use strict'

var usersSuggestionsjsonController = require('./usersSuggestionsjsonControllerService');

module.exports.usersSuggestions = function usersSuggestions(req, res, next) {
  usersSuggestionsjsonController.usersSuggestions(req.swagger.params, res, next);
};

module.exports.usersSuggestionsJsonPARAMETERS = function usersSuggestionsJsonPARAMETERS(req, res, next) {
  usersSuggestionsjsonController.usersSuggestionsJsonPARAMETERS(req.swagger.params, res, next);
};