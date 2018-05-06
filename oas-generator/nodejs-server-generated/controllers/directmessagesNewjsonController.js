'use strict'

var directmessagesNewjsonController = require('./directmessagesNewjsonControllerService');

module.exports.direct_messagesNewJsonPARAMETERS = function direct_messagesNewJsonPARAMETERS(req, res, next) {
  directmessagesNewjsonController.direct_messagesNewJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.direct_messagesNew = function direct_messagesNew(req, res, next) {
  directmessagesNewjsonController.direct_messagesNew(req.swagger.params, res, next);
};