'use strict'

var directmessagesShowjsonController = require('./directmessagesShowjsonControllerService');

module.exports.direct_messagesShow = function direct_messagesShow(req, res, next) {
  directmessagesShowjsonController.direct_messagesShow(req.swagger.params, res, next);
};

module.exports.direct_messagesShowJsonPARAMETERS = function direct_messagesShowJsonPARAMETERS(req, res, next) {
  directmessagesShowjsonController.direct_messagesShowJsonPARAMETERS(req.swagger.params, res, next);
};