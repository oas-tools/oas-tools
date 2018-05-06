'use strict'

var statusesOembedjsonController = require('./statusesOembedjsonControllerService');

module.exports.statusesOembed = function statusesOembed(req, res, next) {
  statusesOembedjsonController.statusesOembed(req.swagger.params, res, next);
};

module.exports.statusesOembedJsonPARAMETERS = function statusesOembedJsonPARAMETERS(req, res, next) {
  statusesOembedjsonController.statusesOembedJsonPARAMETERS(req.swagger.params, res, next);
};