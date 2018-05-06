'use strict'

var listsSubscribersDestroyjsonController = require('./listsSubscribersDestroyjsonControllerService');

module.exports.listsSubscribersDestroyJsonPARAMETERS = function listsSubscribersDestroyJsonPARAMETERS(req, res, next) {
  listsSubscribersDestroyjsonController.listsSubscribersDestroyJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.listsSubscribersDestroy = function listsSubscribersDestroy(req, res, next) {
  listsSubscribersDestroyjsonController.listsSubscribersDestroy(req.swagger.params, res, next);
};