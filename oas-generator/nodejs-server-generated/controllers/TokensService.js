'use strict'

module.exports.allTokens = function allTokens(req, res, next) {
  res.send({
    message: 'This is the raw controller for allTokens'
  });
};

module.exports.createToken = function createToken(req, res, next) {
  res.send({
    message: 'This is the raw controller for createToken'
  });
};

module.exports.destroyToken = function destroyToken(req, res, next) {
  res.send({
    message: 'This is the raw controller for destroyToken'
  });
};

module.exports.getToken = function getToken(req, res, next) {
  res.send({
    message: 'This is the raw controller for getToken'
  });
};

module.exports.updateToken = function updateToken(req, res, next) {
  res.send({
    message: 'This is the raw controller for updateToken'
  });
};

module.exports.replaceToken = function replaceToken(req, res, next) {
  res.send({
    message: 'This is the raw controller for replaceToken'
  });
};