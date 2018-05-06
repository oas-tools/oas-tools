'use strict'

var listsSubscribersjsonController = require('./listsSubscribersjsonControllerService');

module.exports.listsSubscribers = function listsSubscribers(req, res, next) {
  listsSubscribersjsonController.listsSubscribers(req.swagger.params, res, next);
};

module.exports.listsSubscribersJsonPARAMETERS = function listsSubscribersJsonPARAMETERS(req, res, next) {
  listsSubscribersjsonController.listsSubscribersJsonPARAMETERS(req.swagger.params, res, next);
};