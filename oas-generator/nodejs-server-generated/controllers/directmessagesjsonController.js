'use strict'

var directmessagesjsonController = require('./directmessagesjsonControllerService');

module.exports.direct_messages = function direct_messages(req, res, next) {
  directmessagesjsonController.direct_messages(req.swagger.params, res, next);
};

module.exports.direct_messagesJsonPARAMETERS = function direct_messagesJsonPARAMETERS(req, res, next) {
  directmessagesjsonController.direct_messagesJsonPARAMETERS(req.swagger.params, res, next);
};