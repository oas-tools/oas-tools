'use strict'

var productsController = require('./productsControllerService');

module.exports.productsGET = function productsGET(req, res, next) {
  productsController.productsGET(req.swagger.params, res, next);
};