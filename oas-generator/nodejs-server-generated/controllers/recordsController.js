module.exports.performSearch = function performSearch(req, res, next) {
  recordsController.performSearch(req.swagger.params, res, next);
};