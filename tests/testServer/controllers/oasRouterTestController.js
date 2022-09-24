/** @oastools {Controller} /api/v1/oasRouter */

import * as service from './oasRouterTestService.js';

function sleep(duration) {
  return new Promise((res, _rej) => setTimeout(() => res(), duration))
}

/**
 * @oastools {method} GET
 */
export function getRequest(req, res, next) {
  service.getRequest(req, res, next);
};

/**
 * @oastools {method} GET
 * @oastools {path} /async
 */
export async function getRequestAsync(req, res, next) {
  await sleep(1000)
  service.getRequest(req, res, next);
};

/**
 * @oastools {method} GET
 * @oastools {path} /asyncthrow
 */
export async function getRequestAsyncThrow(req, res, next) {
  await sleep(1000)
  service.getRequestThrow(req, res, next);
};