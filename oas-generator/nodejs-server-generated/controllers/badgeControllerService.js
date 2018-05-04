'use strict'

module.exports.getBadge = function getBadge(req, res, next) {
  res.send({
    message: 'This is the raw controller for getBadge'
  });
};