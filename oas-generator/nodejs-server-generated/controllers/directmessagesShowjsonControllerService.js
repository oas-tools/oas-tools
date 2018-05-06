'use strict'

module.exports.direct_messagesShow = function direct_messagesShow(req, res, next) {
  res.send({
    message: 'This is the raw controller for direct_messagesShow'
  });
};

module.exports.direct_messagesShowJsonPARAMETERS = function direct_messagesShowJsonPARAMETERS(req, res, next) {
  res.send({
    message: 'This is the raw controller for direct_messagesShowJsonPARAMETERS'
  });
};