'use strict'

module.exports.direct_messagesSent = function direct_messagesSent(req, res, next) {
  res.send({
    message: 'This is the raw controller for direct_messagesSent'
  });
};

module.exports.direct_messagesSentJsonPARAMETERS = function direct_messagesSentJsonPARAMETERS(req, res, next) {
  res.send({
    message: 'This is the raw controller for direct_messagesSentJsonPARAMETERS'
  });
};