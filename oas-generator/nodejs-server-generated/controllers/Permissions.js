'use strict'

var Permissions = require('./PermissionsService');

module.exports.allPermissions = function allPermissions(req, res, next) {
  Permissions.allPermissions(req.swagger.params, res, next);
};

module.exports.createPermission = function createPermission(req, res, next) {
  Permissions.createPermission(req.swagger.params, res, next);
};

module.exports.destroyPermission = function destroyPermission(req, res, next) {
  Permissions.destroyPermission(req.swagger.params, res, next);
};

module.exports.getPermission = function getPermission(req, res, next) {
  Permissions.getPermission(req.swagger.params, res, next);
};

module.exports.updatePermission = function updatePermission(req, res, next) {
  Permissions.updatePermission(req.swagger.params, res, next);
};

module.exports.replacePermission = function replacePermission(req, res, next) {
  Permissions.replacePermission(req.swagger.params, res, next);
};