'use strict'

var estimatesPriceController = require('./estimatesPriceControllerService');

module.exports.estimatesPriceGET = function estimatesPriceGET(req, res, next) {
  estimatesPriceController.estimatesPriceGET(req.swagger.params, res, next);
};