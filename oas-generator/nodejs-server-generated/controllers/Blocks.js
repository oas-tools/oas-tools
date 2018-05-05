'use strict'

var Blocks = require('./BlocksService');

module.exports.allBlocks = function allBlocks(req, res, next) {
  Blocks.allBlocks(req.swagger.params, res, next);
};

module.exports.createBlock = function createBlock(req, res, next) {
  Blocks.createBlock(req.swagger.params, res, next);
};

module.exports.destroyBlock = function destroyBlock(req, res, next) {
  Blocks.destroyBlock(req.swagger.params, res, next);
};

module.exports.getBlock = function getBlock(req, res, next) {
  Blocks.getBlock(req.swagger.params, res, next);
};

module.exports.updateBlock = function updateBlock(req, res, next) {
  Blocks.updateBlock(req.swagger.params, res, next);
};

module.exports.replaceBlock = function replaceBlock(req, res, next) {
  Blocks.replaceBlock(req.swagger.params, res, next);
};