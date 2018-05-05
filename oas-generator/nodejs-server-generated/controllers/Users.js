'use strict'

var Users = require('./UsersService');

module.exports.currentUser = function currentUser(req, res, next) {
  Users.currentUser(req.swagger.params, res, next);
};

module.exports.getCurrentUserThrottle = function getCurrentUserThrottle(req, res, next) {
  Users.getCurrentUserThrottle(req.swagger.params, res, next);
};