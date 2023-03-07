/** @oastools {Controller} /api/v1/oasResponseValidator */

import * as service from './oasResponseValidatorTestService.js';

/**
 * @oastools {method} GET
 */
export function getRequest(req, res, next) {
  service.getRequest(req.params, res, next);
};

/**
 * @oastools {method} DELETE
 */
export function deleteRequest(req, res, next) {
  service.deleteRequest(req.params, res, next);
};

/**
 * @oastools {method} GET
 * @oastools {path} /unexpectedResponse
 */
export function getRequestUnexpected(req, res, next) {
  service.getRequestUnexpected(req.params, res, next);
};

/**
 * @oastools {method} GET
 * @oastools {path} /wrongData
 */
export function getRequestWrongData(req, res, next) {
  service.getRequestWrongData(req.params, res, next);
};

/**
 * @oastools {method} GET
 * @oastools {path} /body/defaultFields
 */
export function getRequestDefaultBody(req, res, next) {
  service.getRequestDefaultBody(req.params, res, next);
}

/**
 * @oastools {method} GET
 * @oastools {path} /body/writeOnlyProp
 */
export function getRequestWriteOnlyProp(req, res, next) {
  service.getRequestWriteOnlyProp(req.params, res, next);
}