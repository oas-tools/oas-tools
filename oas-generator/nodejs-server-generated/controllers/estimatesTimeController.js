'use strict'

var estimatesTimeController = require('./estimatesTimeControllerService');

module.exports.estimatesTimeGET = function estimatesTimeGET(req, res, next) {
  estimatesTimeController.estimatesTimeGET(req.swagger.params, res, next);
};