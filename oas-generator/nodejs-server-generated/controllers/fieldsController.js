module.exports.listSearchableFields = function listSearchableFields(req, res, next) {
  fieldsController.listSearchableFields(req.swagger.params, res, next);
};