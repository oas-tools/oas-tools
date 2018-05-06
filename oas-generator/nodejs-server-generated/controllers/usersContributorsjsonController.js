'use strict'

var usersContributorsjsonController = require('./usersContributorsjsonControllerService');

module.exports.usersContributors = function usersContributors(req, res, next) {
  usersContributorsjsonController.usersContributors(req.swagger.params, res, next);
};

module.exports.usersContributorsJsonPARAMETERS = function usersContributorsJsonPARAMETERS(req, res, next) {
  usersContributorsjsonController.usersContributorsJsonPARAMETERS(req.swagger.params, res, next);
};