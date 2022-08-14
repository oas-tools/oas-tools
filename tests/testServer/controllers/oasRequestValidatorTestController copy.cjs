/** @oastools {Controller} /api/v1/oasRequestValidator */

var service = require('./oasRequestValidatorTestService.cjs');

/**
 * @oastools {method} POST
 */
 module.exports.postRequest = function postRequest(req, res, next) {
  service.postRequest(req.params, res, next);
};

/**
 * @oastools {path} /missingBody
 * @oastools {method} POST
 */
 module.exports.postRequest = function postRequest(req, res, next) {
  service.postRequest(req.params, res, next);
};

