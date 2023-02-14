export function getRequest(req, res, next) {
  res.send(res.locals.oas);
};

export function postRequest(req, res, next) {
  res.send(res.locals.oas);
};