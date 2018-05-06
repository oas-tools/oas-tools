'use strict'

module.exports.usersShow = function usersShow(req, res, next) {
  res.send({
    message: 'This is the raw controller for usersShow'
  });
};

module.exports.usersShowJsonPARAMETERS = function usersShowJsonPARAMETERS(req, res, next) {
  res.send({
    message: 'This is the raw controller for usersShowJsonPARAMETERS'
  });
};