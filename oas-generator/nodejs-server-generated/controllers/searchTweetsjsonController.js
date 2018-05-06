'use strict'

var searchTweetsjsonController = require('./searchTweetsjsonControllerService');

module.exports.searchTweets = function searchTweets(req, res, next) {
  searchTweetsjsonController.searchTweets(req.swagger.params, res, next);
};

module.exports.searchTweetsJsonPARAMETERS = function searchTweetsJsonPARAMETERS(req, res, next) {
  searchTweetsjsonController.searchTweetsJsonPARAMETERS(req.swagger.params, res, next);
};