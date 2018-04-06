/*!
OAS-tools module 0.0.0, built on: 2017-03-30
Copyright (C) 2017 Ignacio Peluaga Lozada (ISA Group)
https://github.com/ignpelloz
https://github.com/isa-group/project-oas-tools

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.*/

'use strict';

var _ = require('lodash-compat');
var fs = require('fs');
var path = require('path');
var jsyaml = require('js-yaml');
var config = require('./configurations'),
  logger = config.logger;
var ZSchema = require("z-schema");
var deref = require('json-schema-deref');
var validator = new ZSchema({
  ignoreUnresolvableReferences: true
});
var controllers;
var customConfigurations = false;

/**
 * Function to set configurations. Initializes local variables that then will be used in the callback inside initializeMiddleware function.
 *@param {object} options - Parameter containing controllers location, enable logs, and strict checks. It can be a STRING or an OBJECT.
 */
var configure = function configure(options) {
  config.setConfigurations(options);
};

/**
 * Transforms yaml's spec path format to Express format.
 *@param {object} path - Path to transform.
 */
function transformToExpress(path) {
  var res = "";
  for (var c in path) {
    if (path[c] == '{') {
      res = res + ':';
    } else if (path[c] == '}') {
      res = res + '';
    } else {
      res = res + path[c];
    }
  }
  return res;
}

/**
 * Function to initialize middlewares.
 *@param {object} options - Parameter containing controllers location, Specification file, and others.
 *@param {function} callback - Function that initializes middlewares one by one in the index.js file.
 */
var initializeMiddleware = function initializeMiddleware(oasDoc, app, callback) {

  if (_.isUndefined(oasDoc)) {
    throw new Error('oasDoc is required');
  } else if (!_.isPlainObject(oasDoc)) {
    throw new TypeError('oasDoc must be an object');
  }

  if (_.isUndefined(callback)) {
    throw new Error('callback is required');
  } else if (!_.isFunction(callback)) {
    throw new TypeError('callback must be a function');
  }

  var schemaV3 = fs.readFileSync(path.join(__dirname, './schemas/openapi-3.0.json'), 'utf8');
  schemaV3 = JSON.parse(schemaV3);

  validator.validate(oasDoc, schemaV3, function(err, valid) {
    if (err) {
      logger.error("oasDoc is not valid: " + JSON.stringify(err));
      process.exit();
    } else {
      logger.info("Valid specification file");
    }
  });

  deref(oasDoc, function(err, fullSchema) {
    logger.info("Specification file dereferenced");
    oasDoc = fullSchema;

    //THE FOLLOWING THREE SECTIONS ARE INSIDE THE deref CALL BECAUSE OTHERWISE oasDoc WOULDN'T HAVE THE RIGHT VALUE of 'fullSchema'
    var OASRouterMid = function() {
      var OASRouter = require('./middleware/oas-router');
      return OASRouter.call(undefined, config.controllers); // ROUTER NEEDS JUST CONTROLLERS
    };
    var OASValidatorMid = function() {
      var OASValidator = require('./middleware/oas-validator');
      return OASValidator.call(undefined, oasDoc, app._router.stack); // VALIDATOR NEEDS JUST SPEC-FILE
    };

    var paths = oasDoc.paths;
    for (path in paths) {
      for (var method in paths[path]) {
        var expressPath = transformToExpress(path);
        switch (method) {
          case 'get':
            if (config.validator == true) {
              app.get(expressPath, OASValidatorMid());
            }
            if (config.router == true) {
              app.get(expressPath, OASRouterMid());
            }
            break;
          case 'post':
            if (config.validator == true) {
              app.post(expressPath, OASValidatorMid());
            }
            if (config.router == true) {
              app.post(expressPath, OASRouterMid());
            }
            break;
          case 'put':
            if (config.validator == true) {
              app.put(expressPath, OASValidatorMid());
            }
            if (config.router == true) {
              app.put(expressPath, OASRouterMid());
            }
            break;
          case 'delete':
            if (config.validator == true) {
              app.delete(expressPath, OASValidatorMid());
            }
            if (config.router == true) {
              app.delete(expressPath, OASRouterMid());
            }
            break;
        }
      }
    }

    callback();
  });
};

module.exports = {
  initializeMiddleware: initializeMiddleware,
  configure: configure,
};
