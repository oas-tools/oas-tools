'use strict'

var Groups = require('./GroupsService');

module.exports.allGroups = function allGroups(req, res, next) {
  Groups.allGroups(req.swagger.params, res, next);
};

module.exports.createGroup = function createGroup(req, res, next) {
  Groups.createGroup(req.swagger.params, res, next);
};

module.exports.destroyGroup = function destroyGroup(req, res, next) {
  Groups.destroyGroup(req.swagger.params, res, next);
};

module.exports.getGroup = function getGroup(req, res, next) {
  Groups.getGroup(req.swagger.params, res, next);
};

module.exports.updateGroup = function updateGroup(req, res, next) {
  Groups.updateGroup(req.swagger.params, res, next);
};

module.exports.replaceGroup = function replaceGroup(req, res, next) {
  Groups.replaceGroup(req.swagger.params, res, next);
};

module.exports.addFeedToGroup = function addFeedToGroup(req, res, next) {
  Groups.addFeedToGroup(req.swagger.params, res, next);
};

module.exports.removeFeedFromGroup = function removeFeedFromGroup(req, res, next) {
  Groups.removeFeedFromGroup(req.swagger.params, res, next);
};