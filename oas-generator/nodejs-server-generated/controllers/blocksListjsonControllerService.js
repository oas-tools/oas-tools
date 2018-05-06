'use strict'

module.exports.blocksList = function blocksList(req, res, next) {
  res.send({
    message: 'This is the raw controller for blocksList'
  });
};

module.exports.blocksListJsonPARAMETERS = function blocksListJsonPARAMETERS(req, res, next) {
  res.send({
    message: 'This is the raw controller for blocksListJsonPARAMETERS'
  });
};