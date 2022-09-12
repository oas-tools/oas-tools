/** @oastools {Controller} /api/v1/oasRouter */

var service = require('./oasRouterTestService.cjs');

/**
 * @oastools {method} GET
 */
 module.exports.getRequest = function getRequest(req, res, next) {
  service.getRequest(req.params, res, next);
};

/**
 * @oastools {method} GET
 * @oastools {path} /async
 */
module.exports.getRequestAsync = function getRequest(req, res, next) {
  new Promise((res, _rej) => setTimeout(() => res(), 1000)).then(() => service.getRequest(req.params, res, next));
};