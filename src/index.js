'use strict';

var _ = require('lodash-compat');
var ZSchema = require("z-schema");
var fs = require('fs');
var path = require('path');
var spec;
var debug = true;
var logger = require('./logger/logger');


/**
 * Function to initialize middlewares
 *@param {object} specDoc - Specification file, specDoc from the index.js.
 *@param {function} callback - Function that initializes middlewares one by one in the index.js file.
 */
var initializeMiddleware = function initializeMiddleware(specDoc, callback) {
  spec = specDoc;

  if (_.isUndefined(specDoc)) {
    throw new Error('specDoc is required');
  } else if (!_.isPlainObject(specDoc)) {
    throw new TypeError('specDoc must be an object');
  }

  if (_.isUndefined(callback)) {
    throw new Error('callback is required');
  } else if (!_.isFunction(callback)) {
    throw new TypeError('callback must be a function');
  }

  var validator = new ZSchema({
    ignoreUnresolvableReferences: true
  });

  var schemaV3 = fs.readFileSync(path.join(__dirname, './schemas/openapi-3.0.json'), 'utf8');
  schemaV3 = JSON.parse(schemaV3);

  validator.validate(specDoc, schemaV3, function(err, valid) {
    if (err) {
      throw new Error('specDoc is not valid: ');
      logger.info("Error: " + err);
    } else {
      logger.info("Valid specification file");
    }
  });

  callback({
    OASRouter: require('./middleware/oas-router'),
    OASValidator: require('./middleware/oas-validator')
  });
};

module.exports = {
  initializeMiddleware: initializeMiddleware,
};
