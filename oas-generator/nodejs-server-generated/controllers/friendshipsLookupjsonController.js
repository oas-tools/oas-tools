'use strict'

var friendshipsLookupjsonController = require('./friendshipsLookupjsonControllerService');

module.exports.friendshipsLookup = function friendshipsLookup(req, res, next) {
  friendshipsLookupjsonController.friendshipsLookup(req.swagger.params, res, next);
};

module.exports.friendshipsLookupJsonPARAMETERS = function friendshipsLookupJsonPARAMETERS(req, res, next) {
  friendshipsLookupjsonController.friendshipsLookupJsonPARAMETERS(req.swagger.params, res, next);
};