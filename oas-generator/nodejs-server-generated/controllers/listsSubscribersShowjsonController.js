'use strict'

var listsSubscribersShowjsonController = require('./listsSubscribersShowjsonControllerService');

module.exports.listsSubscribersShow = function listsSubscribersShow(req, res, next) {
  listsSubscribersShowjsonController.listsSubscribersShow(req.swagger.params, res, next);
};

module.exports.listsSubscribersShowJsonPARAMETERS = function listsSubscribersShowJsonPARAMETERS(req, res, next) {
  listsSubscribersShowjsonController.listsSubscribersShowJsonPARAMETERS(req.swagger.params, res, next);
};