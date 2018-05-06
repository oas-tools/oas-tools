'use strict'

var usersContributeesjsonController = require('./usersContributeesjsonControllerService');

module.exports.usersContributees = function usersContributees(req, res, next) {
  usersContributeesjsonController.usersContributees(req.swagger.params, res, next);
};

module.exports.usersContributeesJsonPARAMETERS = function usersContributeesJsonPARAMETERS(req, res, next) {
  usersContributeesjsonController.usersContributeesJsonPARAMETERS(req.swagger.params, res, next);
};