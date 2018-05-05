'use strict'

module.exports.allBlocks = function allBlocks(req, res, next) {
  res.send({
    message: 'This is the raw controller for allBlocks'
  });
};

module.exports.createBlock = function createBlock(req, res, next) {
  res.send({
    message: 'This is the raw controller for createBlock'
  });
};

module.exports.destroyBlock = function destroyBlock(req, res, next) {
  res.send({
    message: 'This is the raw controller for destroyBlock'
  });
};

module.exports.getBlock = function getBlock(req, res, next) {
  res.send({
    message: 'This is the raw controller for getBlock'
  });
};

module.exports.updateBlock = function updateBlock(req, res, next) {
  res.send({
    message: 'This is the raw controller for updateBlock'
  });
};

module.exports.replaceBlock = function replaceBlock(req, res, next) {
  res.send({
    message: 'This is the raw controller for replaceBlock'
  });
};