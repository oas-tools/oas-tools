'use strict'

var Activities = require('./ActivitiesService');

module.exports.destroyActivities = function destroyActivities(req, res, next) {
  Activities.destroyActivities(req.swagger.params, res, next);
};

module.exports.allActivities = function allActivities(req, res, next) {
  Activities.allActivities(req.swagger.params, res, next);
};

module.exports.getActivity = function getActivity(req, res, next) {
  Activities.getActivity(req.swagger.params, res, next);
};