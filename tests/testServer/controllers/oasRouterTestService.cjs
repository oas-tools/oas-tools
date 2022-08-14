'use strict'

module.exports.getRequest = function getRequest(req, res, next) {
  res.send('Test service for router middleware');
};