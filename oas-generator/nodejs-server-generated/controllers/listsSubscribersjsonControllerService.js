'use strict'

module.exports.listsSubscribers = function listsSubscribers(req, res, next) {
  res.send({
    message: 'This is the raw controller for listsSubscribers'
  });
};

module.exports.listsSubscribersJsonPARAMETERS = function listsSubscribersJsonPARAMETERS(req, res, next) {
  res.send({
    message: 'This is the raw controller for listsSubscribersJsonPARAMETERS'
  });
};