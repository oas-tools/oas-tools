'use strict'

var accountUpdateprofilejsonController = require('./accountUpdateprofilejsonControllerService');

module.exports.accountUpdate_profileJsonPARAMETERS = function accountUpdate_profileJsonPARAMETERS(req, res, next) {
  accountUpdateprofilejsonController.accountUpdate_profileJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.accountUpdate_profile = function accountUpdate_profile(req, res, next) {
  accountUpdateprofilejsonController.accountUpdate_profile(req.swagger.params, res, next);
};