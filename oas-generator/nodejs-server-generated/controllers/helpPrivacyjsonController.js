'use strict'

var helpPrivacyjsonController = require('./helpPrivacyjsonControllerService');

module.exports.helpPrivacy = function helpPrivacy(req, res, next) {
  helpPrivacyjsonController.helpPrivacy(req.swagger.params, res, next);
};

module.exports.helpPrivacyJsonPARAMETERS = function helpPrivacyJsonPARAMETERS(req, res, next) {
  helpPrivacyjsonController.helpPrivacyJsonPARAMETERS(req.swagger.params, res, next);
};