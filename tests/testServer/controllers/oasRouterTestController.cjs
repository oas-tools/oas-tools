/** @oastools {Controller} /api/v1/oasRouter */

var service = require('./oasRouterTestService.cjs');

/**
 * @oastools {method} GET
 */
 module.exports.getRequest = function getRequest(req, res, next) {
  service.getRequest(req.params, res, next);
};