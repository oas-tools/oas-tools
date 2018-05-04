'use strict'

module.exports.getStatus = function getStatus(req, res, next) {
  res.send({
    message: 'This is the raw controller for getStatus'
  });
};