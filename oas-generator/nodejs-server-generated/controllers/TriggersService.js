'use strict'

module.exports.allTriggers = function allTriggers(req, res, next) {
  res.send({
    message: 'This is the raw controller for allTriggers'
  });
};

module.exports.createTrigger = function createTrigger(req, res, next) {
  res.send({
    message: 'This is the raw controller for createTrigger'
  });
};

module.exports.destroyTrigger = function destroyTrigger(req, res, next) {
  res.send({
    message: 'This is the raw controller for destroyTrigger'
  });
};

module.exports.getTrigger = function getTrigger(req, res, next) {
  res.send({
    message: 'This is the raw controller for getTrigger'
  });
};

module.exports.updateTrigger = function updateTrigger(req, res, next) {
  res.send({
    message: 'This is the raw controller for updateTrigger'
  });
};

module.exports.replaceTrigger = function replaceTrigger(req, res, next) {
  res.send({
    message: 'This is the raw controller for replaceTrigger'
  });
};