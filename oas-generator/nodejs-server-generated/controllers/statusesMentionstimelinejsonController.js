'use strict'

var statusesMentionstimelinejsonController = require('./statusesMentionstimelinejsonControllerService');

module.exports.statusesMentionsTimeline = function statusesMentionsTimeline(req, res, next) {
  statusesMentionstimelinejsonController.statusesMentionsTimeline(req.swagger.params, res, next);
};

module.exports.statusesMentions_timelineJsonPARAMETERS = function statusesMentions_timelineJsonPARAMETERS(req, res, next) {
  statusesMentionstimelinejsonController.statusesMentions_timelineJsonPARAMETERS(req.swagger.params, res, next);
};