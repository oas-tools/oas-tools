'use strict'

var statusController = require('./statusControllerService');

module.exports.getStatus = function getStatus(req, res, next) {
  statusController.getStatus(req.swagger.params, res, next);
};