'use strict'

var badgeController = require('./badgeControllerService');

module.exports.getBadge = function getBadge(req, res, next) {
  badgeController.getBadge(req.swagger.params, res, next);
};