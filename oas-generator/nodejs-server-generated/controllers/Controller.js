'use strict'

var Controller = require('./ControllerService');

module.exports.undefined = function undefined(req, res, next) {
  Controller.undefined(req.swagger.params, res, next);
};