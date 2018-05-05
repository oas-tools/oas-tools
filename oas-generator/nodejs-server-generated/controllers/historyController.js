'use strict'

var historyController = require('./historyControllerService');

module.exports.historyGET = function historyGET(req, res, next) {
  historyController.historyGET(req.swagger.params, res, next);
};