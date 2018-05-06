'use strict'

var listsStatusesjsonController = require('./listsStatusesjsonControllerService');

module.exports.listsStatuses = function listsStatuses(req, res, next) {
  listsStatusesjsonController.listsStatuses(req.swagger.params, res, next);
};

module.exports.listsStatusesJsonPARAMETERS = function listsStatusesJsonPARAMETERS(req, res, next) {
  listsStatusesjsonController.listsStatusesJsonPARAMETERS(req.swagger.params, res, next);
};