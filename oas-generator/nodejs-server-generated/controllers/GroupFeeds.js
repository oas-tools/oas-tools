'use strict'

var GroupFeeds = require('./GroupFeedsService');

module.exports.allGroupFeeds = function allGroupFeeds(req, res, next) {
  GroupFeeds.allGroupFeeds(req.swagger.params, res, next);
};

module.exports.createGroupFeed = function createGroupFeed(req, res, next) {
  GroupFeeds.createGroupFeed(req.swagger.params, res, next);
};