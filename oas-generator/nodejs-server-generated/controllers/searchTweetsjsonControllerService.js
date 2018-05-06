'use strict'

module.exports.searchTweets = function searchTweets(req, res, next) {
  res.send({
    message: 'This is the raw controller for searchTweets'
  });
};

module.exports.searchTweetsJsonPARAMETERS = function searchTweetsJsonPARAMETERS(req, res, next) {
  res.send({
    message: 'This is the raw controller for searchTweetsJsonPARAMETERS'
  });
};