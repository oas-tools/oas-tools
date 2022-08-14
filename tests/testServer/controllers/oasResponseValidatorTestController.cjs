/** @oastools {Controller} /api/v1/oasResponseValidator */

var service = require('./oasResponseValidatorTestService.cjs');

/**
 * @oastools {method} GET
 */
 module.exports.getRequest = function getRequest(req, res, next) {
  service.getRequest(req.params, res, next);
};

/**
 * @oastools {method} DELETE
 */
 module.exports.deleteRequest = function deleteRequest(req, res, next) {
  service.deleteRequest(req.params, res, next);
};

/**
 * @oastools {method} GET
 * @oastools {path} /unexpectedResponse
 */
 module.exports.getRequestUnexpected = function getRequestUnexpected(req, res, next) {
  service.getRequestUnexpected(req.params, res, next);
};

/**
 * @oastools {method} GET
 * @oastools {path} /wrongData
 */
 module.exports.getRequestWrongData = function getRequestWrongData(req, res, next) {
  service.getRequestWrongData(req.params, res, next);
};
