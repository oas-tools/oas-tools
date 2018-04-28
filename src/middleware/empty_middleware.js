'use strict';
var exports;
exports = module.exports = function() {
  return function (req, res, next) {
    console.log("This does nothing actually");
    next();
  }
}
