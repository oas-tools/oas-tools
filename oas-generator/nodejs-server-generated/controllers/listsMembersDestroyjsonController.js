'use strict'

var listsMembersDestroyjsonController = require('./listsMembersDestroyjsonControllerService');

module.exports.listsMembersDestroyJsonPARAMETERS = function listsMembersDestroyJsonPARAMETERS(req, res, next) {
  listsMembersDestroyjsonController.listsMembersDestroyJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.listsMembersDestroy = function listsMembersDestroy(req, res, next) {
  listsMembersDestroyjsonController.listsMembersDestroy(req.swagger.params, res, next);
};