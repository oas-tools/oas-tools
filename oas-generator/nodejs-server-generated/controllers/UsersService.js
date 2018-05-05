'use strict'

module.exports.currentUser = function currentUser(req, res, next) {
  res.send({
    message: 'This is the raw controller for currentUser'
  });
};

module.exports.getCurrentUserThrottle = function getCurrentUserThrottle(req, res, next) {
  res.send({
    message: 'This is the raw controller for getCurrentUserThrottle'
  });
};