'use strict'

var statusesHometimelinejsonController = require('./statusesHometimelinejsonControllerService');

module.exports.statusesHome_timeline = function statusesHome_timeline(req, res, next) {
  statusesHometimelinejsonController.statusesHome_timeline(req.swagger.params, res, next);
};

module.exports.statusesHome_timelineJsonPARAMETERS = function statusesHome_timelineJsonPARAMETERS(req, res, next) {
  statusesHometimelinejsonController.statusesHome_timelineJsonPARAMETERS(req.swagger.params, res, next);
};