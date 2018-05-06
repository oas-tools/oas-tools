'use strict'

module.exports.usersLookup = function usersLookup(req, res, next) {
  res.send({
    message: 'This is the raw controller for usersLookup'
  });
};

module.exports.usersLookupJsonPARAMETERS = function usersLookupJsonPARAMETERS(req, res, next) {
  res.send({
    message: 'This is the raw controller for usersLookupJsonPARAMETERS'
  });
};