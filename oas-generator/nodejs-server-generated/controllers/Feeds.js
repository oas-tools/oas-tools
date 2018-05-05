'use strict'

var Feeds = require('./FeedsService');

module.exports.allFeeds = function allFeeds(req, res, next) {
  Feeds.allFeeds(req.swagger.params, res, next);
};

module.exports.createFeed = function createFeed(req, res, next) {
  Feeds.createFeed(req.swagger.params, res, next);
};

module.exports.destroyFeed = function destroyFeed(req, res, next) {
  Feeds.destroyFeed(req.swagger.params, res, next);
};

module.exports.getFeed = function getFeed(req, res, next) {
  Feeds.getFeed(req.swagger.params, res, next);
};

module.exports.updateFeed = function updateFeed(req, res, next) {
  Feeds.updateFeed(req.swagger.params, res, next);
};

module.exports.replaceFeed = function replaceFeed(req, res, next) {
  Feeds.replaceFeed(req.swagger.params, res, next);
};

module.exports.getFeedDetails = function getFeedDetails(req, res, next) {
  Feeds.getFeedDetails(req.swagger.params, res, next);
};