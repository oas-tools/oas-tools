'use strict'

var Dashboards = require('./DashboardsService');

module.exports.allDashboards = function allDashboards(req, res, next) {
  Dashboards.allDashboards(req.swagger.params, res, next);
};

module.exports.createDashboard = function createDashboard(req, res, next) {
  Dashboards.createDashboard(req.swagger.params, res, next);
};

module.exports.destroyDashboard = function destroyDashboard(req, res, next) {
  Dashboards.destroyDashboard(req.swagger.params, res, next);
};

module.exports.getDashboard = function getDashboard(req, res, next) {
  Dashboards.getDashboard(req.swagger.params, res, next);
};

module.exports.updateDashboard = function updateDashboard(req, res, next) {
  Dashboards.updateDashboard(req.swagger.params, res, next);
};

module.exports.replaceDashboard = function replaceDashboard(req, res, next) {
  Dashboards.replaceDashboard(req.swagger.params, res, next);
};