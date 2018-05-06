'use strict'

var usersReportspamjsonController = require('./usersReportspamjsonControllerService');

module.exports.usersReport_spamJsonPARAMETERS = function usersReport_spamJsonPARAMETERS(req, res, next) {
  usersReportspamjsonController.usersReport_spamJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.usersReport_spam = function usersReport_spam(req, res, next) {
  usersReportspamjsonController.usersReport_spam(req.swagger.params, res, next);
};