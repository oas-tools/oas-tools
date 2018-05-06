'use strict'

var statusesUsertimelinejsonController = require('./statusesUsertimelinejsonControllerService');

module.exports.statusesUser_timeline = function statusesUser_timeline(req, res, next) {
  statusesUsertimelinejsonController.statusesUser_timeline(req.swagger.params, res, next);
};

module.exports.statusesUser_timelineJsonPARAMETERS = function statusesUser_timelineJsonPARAMETERS(req, res, next) {
  statusesUsertimelinejsonController.statusesUser_timelineJsonPARAMETERS(req.swagger.params, res, next);
};