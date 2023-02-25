/** @oastools {Controller} /api/v1/oasRequestValidator */

import * as service from './oasRequestValidatorTestService.js';

/**
 * @oastools {method} POST
 */
export function postRequest(req, res, next) {
  service.postRequest(req.params, res, next);
};

/**
 * @oastools {path} /missingBody
 * @oastools {method} POST
 */
export function postRequestNoBody(req, res, next) {
  service.postRequest(req.params, res, next);
};

/**
 * @oastools {path} /body/readOnlyProp
 * @oastools {method} POST
 */
export function postRequestReadOnly(req, res, next) {
  service.postRequest(req.params, res, next);
};

