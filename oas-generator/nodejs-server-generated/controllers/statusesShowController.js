'use strict'

var statusesShowController = require('./statusesShowControllerService');

module.exports.statusesShow = function statusesShow(req, res, next) {
  statusesShowController.statusesShow(req.swagger.params, res, next);
};

module.exports.statusesShowIdJsonPARAMETERS = function statusesShowIdJsonPARAMETERS(req, res, next) {
  statusesShowController.statusesShowIdJsonPARAMETERS(req.swagger.params, res, next);
};