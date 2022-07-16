/** @oastools {Controller} /api/v1/oasSecurity */

var service = require('./oasSecurityTestService.cjs');

/**
 * @oastools {method} GET
 */
 module.exports.getRequest = function getRequest(req, res, next) {
  service.getRequest(req.params, res, next);
};


/**
 * @oastools {method} GET
 * @oastools {path} /bearer
 */
 module.exports.getRequest = function getRequest(req, res, next) {
  service.getRequest(req.params, res, next);
};
