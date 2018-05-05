'use strict'

module.exports.meGET = function meGET(req, res, next) {
  res.send({
    message: 'This is the raw controller for meGET'
  });
};