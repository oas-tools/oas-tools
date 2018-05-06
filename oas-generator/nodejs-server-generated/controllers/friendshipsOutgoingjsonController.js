'use strict'

var friendshipsOutgoingjsonController = require('./friendshipsOutgoingjsonControllerService');

module.exports.friendshipsOutgoing = function friendshipsOutgoing(req, res, next) {
  friendshipsOutgoingjsonController.friendshipsOutgoing(req.swagger.params, res, next);
};

module.exports.friendshipsOutgoingJsonPARAMETERS = function friendshipsOutgoingJsonPARAMETERS(req, res, next) {
  friendshipsOutgoingjsonController.friendshipsOutgoingJsonPARAMETERS(req.swagger.params, res, next);
};