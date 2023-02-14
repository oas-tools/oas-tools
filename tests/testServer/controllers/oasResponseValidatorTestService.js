'use strict'

export function getRequest(req, res, next) {
  res.send('Test service for response validator middleware');
};

export function deleteRequest(req, res, next) {
  res.status(204).send('Test response with no content');
};

export function getRequestUnexpected(req, res, next) {
  res.status(401).send('Test with unexpected request');
};

export function getRequestWrongData(req, res, next) {
  res.status(200).send(['Unexpected data type']);
};

export function getRequestDefaultBody(req, res, next) {
  res.status(200).send({message: undefined});
};

export function getRequestWriteOnlyProp(req, res, next) {
  res.status(200).send({readOnlyProp: "write only property is not required for response"});
};