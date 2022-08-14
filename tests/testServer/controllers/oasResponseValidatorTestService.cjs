'use strict'

module.exports.getRequest = function getRequest(req, res, next) {
  res.send('Test service for response validator middleware');
};

module.exports.deleteRequest = function deleteRequest(req, res, next) {
  res.status(204).send('Test response with no content');
};

module.exports.getRequestUnexpected = function getRequestUnexpected(req, res, next) {
  res.status(401).send('Test with unexpected request');
};

module.exports.getRequestWrongData = function getRequestWrongData(req, res, next) {
  res.status(200).send(['Unexpected data type']);
};