'use strict'

var Controller = require('./ControllerService');

module.exports.listDataSets = function listDataSets(req, res, next) {
  Controller.listDataSets(req.swagger.params, res, next);
};