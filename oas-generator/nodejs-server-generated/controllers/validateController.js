'use strict'

var validateController = require('./validateControllerService');

module.exports.validateUrl = function validateUrl(req, res, next) {
  validateController.validateUrl(req.swagger.params, res, next);
};

module.exports.validate = function validate(req, res, next) {
  validateController.validate(req.swagger.params, res, next);
};