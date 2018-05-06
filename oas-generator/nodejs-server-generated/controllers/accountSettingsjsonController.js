'use strict'

var accountSettingsjsonController = require('./accountSettingsjsonControllerService');

module.exports.accountSettingsGet = function accountSettingsGet(req, res, next) {
  accountSettingsjsonController.accountSettingsGet(req.swagger.params, res, next);
};

module.exports.accountSettingsJsonPARAMETERS = function accountSettingsJsonPARAMETERS(req, res, next) {
  accountSettingsjsonController.accountSettingsJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.accountSettingsPost = function accountSettingsPost(req, res, next) {
  accountSettingsjsonController.accountSettingsPost(req.swagger.params, res, next);
};