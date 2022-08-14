'use strict'

module.exports.getRequest = function getRequest(req, res, next) {
  res.send(res.locals.oas);
};