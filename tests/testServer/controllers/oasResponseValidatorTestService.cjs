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

module.exports.getRequestDefaultBody = function getRequestDefaultBody(req, res, next) {
  res.status(200).send({message: undefined});
};

module.exports.getRequestWriteOnlyProp = function getRequestWriteOnlyProp(req, res, next) {
  res.status(200).send({readOnlyProp: "write only property is not required for response"});
};