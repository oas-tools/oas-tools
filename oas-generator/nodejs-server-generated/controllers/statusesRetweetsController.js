'use strict'

var statusesRetweetsController = require('./statusesRetweetsControllerService');

module.exports.statusesRetweets = function statusesRetweets(req, res, next) {
  statusesRetweetsController.statusesRetweets(req.swagger.params, res, next);
};

module.exports.statusesRetweetsIdJsonPARAMETERS = function statusesRetweetsIdJsonPARAMETERS(req, res, next) {
  statusesRetweetsController.statusesRetweetsIdJsonPARAMETERS(req.swagger.params, res, next);
};