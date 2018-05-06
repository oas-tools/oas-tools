'use strict'

var directmessagesSentjsonController = require('./directmessagesSentjsonControllerService');

module.exports.direct_messagesSent = function direct_messagesSent(req, res, next) {
  directmessagesSentjsonController.direct_messagesSent(req.swagger.params, res, next);
};

module.exports.direct_messagesSentJsonPARAMETERS = function direct_messagesSentJsonPARAMETERS(req, res, next) {
  directmessagesSentjsonController.direct_messagesSentJsonPARAMETERS(req.swagger.params, res, next);
};