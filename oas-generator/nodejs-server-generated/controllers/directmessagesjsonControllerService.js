'use strict'

module.exports.direct_messages = function direct_messages(req, res, next) {
  res.send({
    message: 'This is the raw controller for direct_messages'
  });
};

module.exports.direct_messagesJsonPARAMETERS = function direct_messagesJsonPARAMETERS(req, res, next) {
  res.send({
    message: 'This is the raw controller for direct_messagesJsonPARAMETERS'
  });
};