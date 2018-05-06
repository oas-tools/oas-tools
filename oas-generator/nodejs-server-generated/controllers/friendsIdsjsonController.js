'use strict'

var friendsIdsjsonController = require('./friendsIdsjsonControllerService');

module.exports.friendsIds = function friendsIds(req, res, next) {
  friendsIdsjsonController.friendsIds(req.swagger.params, res, next);
};

module.exports.friendsIdsJsonPARAMETERS = function friendsIdsJsonPARAMETERS(req, res, next) {
  friendsIdsjsonController.friendsIdsJsonPARAMETERS(req.swagger.params, res, next);
};