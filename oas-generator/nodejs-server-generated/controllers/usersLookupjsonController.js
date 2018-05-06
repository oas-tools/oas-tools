'use strict'

var usersLookupjsonController = require('./usersLookupjsonControllerService');

module.exports.usersLookup = function usersLookup(req, res, next) {
  usersLookupjsonController.usersLookup(req.swagger.params, res, next);
};

module.exports.usersLookupJsonPARAMETERS = function usersLookupJsonPARAMETERS(req, res, next) {
  usersLookupjsonController.usersLookupJsonPARAMETERS(req.swagger.params, res, next);
};