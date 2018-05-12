'use strict'

var FieldsController = require('./FieldsControllerService');

module.exports.listSearchableFields = function listSearchableFields(req, res, next) {
  FieldsController.listSearchableFields(req.swagger.params, res, next);
};