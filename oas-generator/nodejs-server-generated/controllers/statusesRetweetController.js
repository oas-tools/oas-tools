'use strict'

var statusesRetweetController = require('./statusesRetweetControllerService');

module.exports.statusesRetweetIdJsonPARAMETERS = function statusesRetweetIdJsonPARAMETERS(req, res, next) {
  statusesRetweetController.statusesRetweetIdJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.statusesretweetid = function statusesretweetid(req, res, next) {
  statusesRetweetController.statusesretweetid(req.swagger.params, res, next);
};