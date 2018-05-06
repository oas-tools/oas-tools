'use strict'

var statusesUpdatewithmediajsonController = require('./statusesUpdatewithmediajsonControllerService');

module.exports.statusesUpdate_with_mediaJsonPARAMETERS = function statusesUpdate_with_mediaJsonPARAMETERS(req, res, next) {
  statusesUpdatewithmediajsonController.statusesUpdate_with_mediaJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.statusesUpdate_with_media = function statusesUpdate_with_media(req, res, next) {
  statusesUpdatewithmediajsonController.statusesUpdate_with_media(req.swagger.params, res, next);
};