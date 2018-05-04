'use strict'

module.exports.convertUrl = function convertUrl(req, res, next) {
  res.send({
    message: 'This is the raw controller for convertUrl'
  });
};

module.exports.convert = function convert(req, res, next) {
  res.send({
    message: 'This is the raw controller for convert'
  });
};