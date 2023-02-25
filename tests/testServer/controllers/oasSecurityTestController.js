/** @oastools {Controller} /api/v1/oasSecurity */

import * as service from './oasSecurityTestService.js';

/**
 * @oastools {method} GET
 */
export function getRequest(req, res, next) {
  service.getRequest(req.params, res, next);
};


/**
 * @oastools {method} GET
 * @oastools {path} /bearer
 */
export function getRequestBearer(req, res, next) {
  service.getRequest(req.params, res, next);
};
