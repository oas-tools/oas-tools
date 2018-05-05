'use strict'

var Triggers = require('./TriggersService');

module.exports.allTriggers = function allTriggers(req, res, next) {
  Triggers.allTriggers(req.swagger.params, res, next);
};

module.exports.createTrigger = function createTrigger(req, res, next) {
  Triggers.createTrigger(req.swagger.params, res, next);
};

module.exports.destroyTrigger = function destroyTrigger(req, res, next) {
  Triggers.destroyTrigger(req.swagger.params, res, next);
};

module.exports.getTrigger = function getTrigger(req, res, next) {
  Triggers.getTrigger(req.swagger.params, res, next);
};

module.exports.updateTrigger = function updateTrigger(req, res, next) {
  Triggers.updateTrigger(req.swagger.params, res, next);
};

module.exports.replaceTrigger = function replaceTrigger(req, res, next) {
  Triggers.replaceTrigger(req.swagger.params, res, next);
};