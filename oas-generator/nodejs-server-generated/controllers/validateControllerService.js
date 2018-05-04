'use strict'

module.exports.validateUrl = function validateUrl(req, res, next) {
  res.send({
    message: 'This is the raw controller for validateUrl'
  });
};

module.exports.validate = function validate(req, res, next) {
  res.send({
    message: 'This is the raw controller for validate'
  });
};