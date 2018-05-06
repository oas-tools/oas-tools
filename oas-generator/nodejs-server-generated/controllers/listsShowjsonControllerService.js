'use strict'

module.exports.listsShow = function listsShow(req, res, next) {
  res.send({
    message: 'This is the raw controller for listsShow'
  });
};

module.exports.listsShowJsonPARAMETERS = function listsShowJsonPARAMETERS(req, res, next) {
  res.send({
    message: 'This is the raw controller for listsShowJsonPARAMETERS'
  });
};