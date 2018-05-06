'use strict'

var listsSubscriptionsjsonController = require('./listsSubscriptionsjsonControllerService');

module.exports.listsSubscriptions = function listsSubscriptions(req, res, next) {
  listsSubscriptionsjsonController.listsSubscriptions(req.swagger.params, res, next);
};

module.exports.listsSubscriptionsJsonPARAMETERS = function listsSubscriptionsJsonPARAMETERS(req, res, next) {
  listsSubscriptionsjsonController.listsSubscriptionsJsonPARAMETERS(req.swagger.params, res, next);
};