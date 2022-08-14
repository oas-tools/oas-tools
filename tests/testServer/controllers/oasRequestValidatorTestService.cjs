'use strict'

module.exports.postRequest = function postRequest(req, res, next) {
  res.send('Test service for validator middleware');
};