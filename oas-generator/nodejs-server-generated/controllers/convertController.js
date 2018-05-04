'use strict'

var convertController = require('./convertControllerService');

module.exports.convertUrl = function convertUrl(req, res, next) {
  convertController.convertUrl(req.swagger.params, res, next);
};

module.exports.convert = function convert(req, res, next) {
  convertController.convert(req.swagger.params, res, next);
};