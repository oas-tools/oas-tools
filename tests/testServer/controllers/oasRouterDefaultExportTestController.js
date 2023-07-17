/** @oastools {Controller} /api/v1/oasRouter */
import * as service from './oasRouterTestService.js';


export default {
  /**
   * @oastools {method} GET
   */
  getRequest(req, res, next) {
    service.getRequest(req, res, next);
  },
}
