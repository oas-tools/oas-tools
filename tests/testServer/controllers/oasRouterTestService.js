export function getRequest(req, res, next) {
  res.send('Test service for router middleware');
};

export function getRequestThrow(req, res, next) {
  throw new Error(`Error raised in async controller`);
};