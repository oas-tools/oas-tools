'use strict'

var accountUpdateprofileimagejsonController = require('./accountUpdateprofileimagejsonControllerService');

module.exports.accountUpdate_profile_imageJsonPARAMETERS = function accountUpdate_profile_imageJsonPARAMETERS(req, res, next) {
  accountUpdateprofileimagejsonController.accountUpdate_profile_imageJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.accountsUpdate_profile_image = function accountsUpdate_profile_image(req, res, next) {
  accountUpdateprofileimagejsonController.accountsUpdate_profile_image(req.swagger.params, res, next);
};