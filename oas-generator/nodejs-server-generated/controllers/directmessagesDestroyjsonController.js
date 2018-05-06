'use strict'

var directmessagesDestroyjsonController = require('./directmessagesDestroyjsonControllerService');

module.exports.direct_messagesDestroyJsonPARAMETERS = function direct_messagesDestroyJsonPARAMETERS(req, res, next) {
  directmessagesDestroyjsonController.direct_messagesDestroyJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.direct_messagesDestroy = function direct_messagesDestroy(req, res, next) {
  directmessagesDestroyjsonController.direct_messagesDestroy(req.swagger.params, res, next);
};