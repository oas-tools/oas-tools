'use strict'

var RecordsController = require('./RecordsControllerService');

module.exports.performSearch = function performSearch(req, res, next) {
  RecordsController.performSearch(req.swagger.params, res, next);
};