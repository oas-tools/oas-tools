'use strict'

var listsMembersDestroyalljsonController = require('./listsMembersDestroyalljsonControllerService');

module.exports.listsMembersDestroy_allJsonPARAMETERS = function listsMembersDestroy_allJsonPARAMETERS(req, res, next) {
  listsMembersDestroyalljsonController.listsMembersDestroy_allJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.listsMembersDestroy_all = function listsMembersDestroy_all(req, res, next) {
  listsMembersDestroyalljsonController.listsMembersDestroy_all(req.swagger.params, res, next);
};