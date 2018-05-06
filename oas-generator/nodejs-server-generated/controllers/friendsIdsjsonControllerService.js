'use strict'

module.exports.friendsIds = function friendsIds(req, res, next) {
  res.send({
    message: 'This is the raw controller for friendsIds'
  });
};

module.exports.friendsIdsJsonPARAMETERS = function friendsIdsJsonPARAMETERS(req, res, next) {
  res.send({
    message: 'This is the raw controller for friendsIdsJsonPARAMETERS'
  });
};