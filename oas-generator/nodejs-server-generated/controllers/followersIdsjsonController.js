'use strict'

var followersIdsjsonController = require('./followersIdsjsonControllerService');

module.exports.followersIds = function followersIds(req, res, next) {
  followersIdsjsonController.followersIds(req.swagger.params, res, next);
};

module.exports.followersIdsJsonPARAMETERS = function followersIdsJsonPARAMETERS(req, res, next) {
  followersIdsjsonController.followersIdsJsonPARAMETERS(req.swagger.params, res, next);
};