/** @oastools {Controller} /api/v1/oasErrorHandler */

import {getRequest as get} from './oasErrorHandlerTestService.js';

/**
 * @oastools {method} GET
 * @oastools {path} /{error}
 */
export function getRequest(req, res, next) {
  get(req.params, res, next);
};