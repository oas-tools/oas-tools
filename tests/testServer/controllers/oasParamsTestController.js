/** @oastools {Controller} /api/v1/oasParams */

import * as service from './oasParamsTestService.js';

/**
 * @oastools {method} GET
 */
export function getRequest(req, res, next) {
  service.getRequest(req.params, res, next);
}

/**
 * @oastools {method} GET
 * @oastools {path} /explode
 */
export function getRequestExplode(req, res, next) {
  service.getRequest(req.params, res, next);
}

/**
 * @oastools {method} GET
 * @oastools {path} /explode/{testparamsimple}/{testparamslabel}/{testparamsmatrix}
 * @oastools {path} /{testparamsimple}/{testparamslabel}/{testparamsmatrix}
 */
export function getRequestPath(req, res, next) {
  service.getRequest(req.params, res, next);
}

/**
 * @oastools {method} GET
 * @oastools {path} /explode/{testparamsimple}/{testparamslabel}/{testparamsmatrix}
 */
export function getRequestPathExplode(req, res, next) {
  service.getRequest(req.params, res, next);
}

/**
 * @oastools {method} POST
 * @oastools {path} /body/defaultFields
 */
export function postRequest(req, res, next) {
  service.postRequest(req.params, res, next);
}

/**
 * @oastools {method} POST
 * @oastools {path} /body/requiredFields
 */
export function postRequest2(req, res, next) {
 service.postRequest(req.params, res, next);
}
