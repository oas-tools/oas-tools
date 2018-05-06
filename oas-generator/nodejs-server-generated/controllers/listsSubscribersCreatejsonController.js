'use strict'

var listsSubscribersCreatejsonController = require('./listsSubscribersCreatejsonControllerService');

module.exports.listsSubscribersCreateJsonPARAMETERS = function listsSubscribersCreateJsonPARAMETERS(req, res, next) {
  listsSubscribersCreatejsonController.listsSubscribersCreateJsonPARAMETERS(req.swagger.params, res, next);
};

module.exports.listsSubscribersCreate = function listsSubscribersCreate(req, res, next) {
  listsSubscribersCreatejsonController.listsSubscribersCreate(req.swagger.params, res, next);
};