'use strict'

var Tokens = require('./TokensService');

module.exports.allTokens = function allTokens(req, res, next) {
  Tokens.allTokens(req.swagger.params, res, next);
};

module.exports.createToken = function createToken(req, res, next) {
  Tokens.createToken(req.swagger.params, res, next);
};

module.exports.destroyToken = function destroyToken(req, res, next) {
  Tokens.destroyToken(req.swagger.params, res, next);
};

module.exports.getToken = function getToken(req, res, next) {
  Tokens.getToken(req.swagger.params, res, next);
};

module.exports.updateToken = function updateToken(req, res, next) {
  Tokens.updateToken(req.swagger.params, res, next);
};

module.exports.replaceToken = function replaceToken(req, res, next) {
  Tokens.replaceToken(req.swagger.params, res, next);
};