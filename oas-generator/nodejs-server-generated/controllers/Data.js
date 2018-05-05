'use strict'

var Data = require('./DataService');

module.exports.allData = function allData(req, res, next) {
  Data.allData(req.swagger.params, res, next);
};

module.exports.createData = function createData(req, res, next) {
  Data.createData(req.swagger.params, res, next);
};

module.exports.batchCreateData = function batchCreateData(req, res, next) {
  Data.batchCreateData(req.swagger.params, res, next);
};

module.exports.chartData = function chartData(req, res, next) {
  Data.chartData(req.swagger.params, res, next);
};

module.exports.firstData = function firstData(req, res, next) {
  Data.firstData(req.swagger.params, res, next);
};

module.exports.lastData = function lastData(req, res, next) {
  Data.lastData(req.swagger.params, res, next);
};

module.exports.nextData = function nextData(req, res, next) {
  Data.nextData(req.swagger.params, res, next);
};

module.exports.previousData = function previousData(req, res, next) {
  Data.previousData(req.swagger.params, res, next);
};

module.exports.retainData = function retainData(req, res, next) {
  Data.retainData(req.swagger.params, res, next);
};

module.exports.destroyData = function destroyData(req, res, next) {
  Data.destroyData(req.swagger.params, res, next);
};

module.exports.getData = function getData(req, res, next) {
  Data.getData(req.swagger.params, res, next);
};

module.exports.updateData = function updateData(req, res, next) {
  Data.updateData(req.swagger.params, res, next);
};

module.exports.replaceData = function replaceData(req, res, next) {
  Data.replaceData(req.swagger.params, res, next);
};

module.exports.createGroupData = function createGroupData(req, res, next) {
  Data.createGroupData(req.swagger.params, res, next);
};

module.exports.allGroupFeedData = function allGroupFeedData(req, res, next) {
  Data.allGroupFeedData(req.swagger.params, res, next);
};

module.exports.createGroupFeedData = function createGroupFeedData(req, res, next) {
  Data.createGroupFeedData(req.swagger.params, res, next);
};

module.exports.batchCreateGroupFeedData = function batchCreateGroupFeedData(req, res, next) {
  Data.batchCreateGroupFeedData(req.swagger.params, res, next);
};