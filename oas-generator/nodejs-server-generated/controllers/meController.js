'use strict'

var meController = require('./meControllerService');

module.exports.meGET = function meGET(req, res, next) {
  meController.meGET(req.swagger.params, res, next);
};