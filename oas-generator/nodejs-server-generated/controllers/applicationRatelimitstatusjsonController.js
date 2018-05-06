'use strict'

var applicationRatelimitstatusjsonController = require('./applicationRatelimitstatusjsonControllerService');

module.exports.applicationRate_limit_status = function applicationRate_limit_status(req, res, next) {
  applicationRatelimitstatusjsonController.applicationRate_limit_status(req.swagger.params, res, next);
};

module.exports.applicationRate_limit_statusJsonPARAMETERS = function applicationRate_limit_statusJsonPARAMETERS(req, res, next) {
  applicationRatelimitstatusjsonController.applicationRate_limit_statusJsonPARAMETERS(req.swagger.params, res, next);
};