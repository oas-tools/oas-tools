'use strict'

module.exports.listsList = function listsList(req, res, next) {
  res.send({
    message: 'This is the raw controller for listsList'
  });
};

module.exports.listsListJsonPARAMETERS = function listsListJsonPARAMETERS(req, res, next) {
  res.send({
    message: 'This is the raw controller for listsListJsonPARAMETERS'
  });
};