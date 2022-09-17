'use strict'

module.exports.getRequest = function getRequest(req, res, next) {
  res.send(res.locals.oas);
};

module.exports.postRequest = function postRequest(req, res, next) {
  res.send(res.locals.oas);
};