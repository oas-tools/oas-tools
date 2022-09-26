/** @oastools {Controller} /api/v1/oasParams */

var service = require('./oasParamsTestService.cjs');

/**
 * @oastools {method} GET
 */
 module.exports.getRequest = function getRequest(req, res, next) {
  service.getRequest(req.params, res, next);
};

/**
 * @oastools {method} GET
 * @oastools {path} /explode
 */
 module.exports.getRequest = function getRequest(req, res, next) {
  service.getRequest(req.params, res, next);
};

/**
 * @oastools {method} GET
 * @oastools {path} /explode/{testparamsimple}/{testparamslabel}/{testparamsmatrix}
 * @oastools {path} /{testparamsimple}/{testparamslabel}/{testparamsmatrix}
 */
module.exports.getRequestPath = function getRequest(req, res, next) {
  service.getRequest(req.params, res, next);
};

/**
 * @oastools {method} GET
 * @oastools {path} /explode/{testparamsimple}/{testparamslabel}/{testparamsmatrix}
 */
 module.exports.getRequestPathExplode = function getRequestPathExplode(req, res, next) {
  service.getRequest(req.params, res, next);
};

/**
 * @oastools {method} POST
 * @oastools {path} /body/defaultFields
 */
 module.exports.postRequest = function postRequest(req, res, next) {
  service.postRequest(req.params, res, next);
};

