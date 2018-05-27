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
var pathModule = require('path');
var jsyaml = require('js-yaml');
var config = require('./configurations'),
  logger = config.logger;
var ZSchema = require("z-schema");
var deref = require('json-schema-deref-sync');
var validator = new ZSchema({
  ignoreUnresolvableReferences: true,
  breakOnFirstError: false
});
var utils = require("./lib/utils.js");
var controllers;
var customConfigurations = false;
var schemaV3 = fs.readFileSync(pathModule.join(__dirname, './schemas/openapi-3.0.json'), 'utf8');
schemaV3 = JSON.parse(schemaV3);


/**
 * Checks that specDoc and callback exist and validates specDoc.
 *@param {object} specDoc - Speceficitation file.
 *@param {object} callback - Callback function passed to the initialization function.
 */
function init_checks(specDoc, callback) {
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

  var err = validator.validate(specDoc, schemaV3);
  if (err == false) {
    logger.error('Specification file is not valid: ' + JSON.stringify(validator.getLastErrors()));
    process.exit();
  } else {
    logger.info("Valid specification file");
  }
}

/**
 * Function to set configurations. Initializes local variables that then will be used in the callback inside initializeMiddleware function.
 *@param {object} options - Parameter containing controllers location, enable logs, and strict checks. It can be a STRING or an OBJECT.
 */
var configure = function configure(options) {
  config.setConfigurations(options);
};

/**
 * Checks if operationId (or generic) and function for it exists on controller for a given pair path-method.
 *@param {object} load - Loaded controller.
 *@param {object} pathName - Path of the spec file to be used to find controller.
 *@param {object} methodName - One of CRUD methods.
 *@param {object} methodSection - Section of the speficication file belonging to methodName.
 */
 function checkOperationId(load, pathName, methodName, methodSection) {
   var opId = undefined;
   var rawOpId = undefined;

   if (_.has(methodSection, 'operationId')) {
     rawOpId = methodSection.operationId;
     opId = utils.generateName(rawOpId, undefined); //there is opId: just normalize
   }

   if (opId == undefined) {
     opId = utils.generateName(pathName, "function") + methodName.toUpperCase(); //there is no opId: normalize and add "func" at the beggining
     logger.debug("      There is no operationId for " + methodName.toUpperCase() + " - " + pathName + " -> generated: " + opId);
   }

   if (load[opId] == undefined) {
     logger.error("      There is no function in the controller for " + methodName.toUpperCase() + " - " + pathName + " (operationId: " + opId + ")");
     process.exit();
   } else {
     logger.debug("      Controller for " + methodName.toUpperCase() + " - " + pathName + ": OK");
   }
 }

/**
 * Checks if exists controller for a given pair path-method.
 *@param {object} pathName - Path of the spec file to be used to find controller.
 *@param {object} methodName - One of CRUD methods.
 *@param {object} methodSection - Section of the speficication file belonging to methodName.
 *@param {object} controllersLocation - Location of controller files.
 */
function checkControllers(pathName, methodName, methodSection, controllersLocation) {
  logger.debug("  " + methodName.toUpperCase() + " - " + pathName);
  var controller;
  var load;
  var router_property;

  if (methodSection['x-router-controller'] != undefined) {
    router_property = 'x-router-controller';
  } else if (methodSection['x-swagger-router-controller'] != undefined) {
    router_property = 'x-swagger-router-controller';
  } else {
    router_property = undefined;
  }

  if (methodSection[router_property] != undefined) {
    controller = methodSection[router_property];
    logger.debug("    OAS-doc has " + router_property + " property");
    try {
      load = require(pathModule.join(controllersLocation, controller));
      checkOperationId(load, pathName, methodName, methodSection);
    } catch (err) {
      logger.error(err);
      process.exit();
    }
  } else {
    controller = utils.generateName(pathName, "controller");
    logger.debug("    Spec-file does not have router property -> try generic controller name: " + controller)
    try {
      var load = require(pathModule.join(controllersLocation, controller));
      checkOperationId(load, pathName, methodName, methodSection);
    } catch (err) {
      logger.debug("    Controller with generic controller name wasn't found either -> try Default one");
      try {
        controller = 'Default' //try to load default one
        var load = require(pathModule.join(controllersLocation, controller));
        checkOperationId(load, pathName, methodName, methodSection);
      } catch (err) {
        logger.error("    There is no controller for " + methodName.toUpperCase() + " - " + pathName);
        process.exit();
      }
    }
  }
}

/**
 * Converts a oas-doc type path into an epxress one.
 * @param {string} oasPath - Path as shown in the oas-doc.
 */
var getExpressVersion = function(oasPath) {
  return oasPath.replace(/{/g, ':').replace(/}/g, '');
}

/**
 * Function to initialize swagger-tools middlewares.
 *@param {object} specDoc - Specification file.
 *@param {function} app - Express application object.
 */
function registerPaths(specDoc, app) {
  var OASRouterMid = function() {
    var OASRouter = require('./middleware/oas-router');
    return OASRouter.call(undefined, config.controllers); // ROUTER NEEDS JUST CONTROLLERS
  };
  var OASValidatorMid = function() {
    var OASValidator = require('./middleware/oas-validator');
    return OASValidator.call(undefined, specDoc); // VALIDATOR NEEDS JUST SPEC-FILE
  };

  var dictionary = {};

  var paths = specDoc.paths;
  for (var path in paths) {
    for (var method in paths[path]) {
      var expressPath = getExpressVersion(path); // TODO: take in account basePath/servers property of the spec doc.
      dictionary[expressPath.toString()] = path;
      logger.debug("Register: " + method.toUpperCase() + " - " + expressPath);
      if (config.router == true) {
        checkControllers(path, method, paths[path][method], config.controllers);
      }
      switch (method) { //TODO: paths must be registered for each url in servers property of the spec doc.
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
  config.pathsDict = dictionary;
}

/**
 * Function to initialize OAS-tools middlewares.
 *@param {object} oasDoc - Specification file.
 *@param {object} app - Express server used for the application. Needed to register the paths.
 *@param {function} callback - Function in which the app is started.
 */
var initialize = function initialize(oasDoc, app, callback) {

  init_checks(oasDoc, callback);

  var fullSchema = deref(oasDoc);
  logger.info("Specification file dereferenced");

  registerPaths(fullSchema, app);

  callback();
};

/**
 * Function to initialize swagger-tools middlewares.
 *@param {object} specDoc - Specification file.
 *@param {function} app - //TODO IN CASE EXPRESS CAN BE USED INSTEAD OF CONNECT, USER MUST PASS THIS TO initializeMiddleware TO REGISTER ROUTES.
 *@param {function} callback - Function that initializes middlewares one by one.
 */
var initializeMiddleware = function initializeMiddleware(specDoc, app, callback) {

  init_checks(specDoc, callback);

  var fullSchema = deref(specDoc);
  logger.info("Specification file dereferenced");

  var middleware = {
    swaggerValidator: require('./middleware/empty_middleware'),
    swaggerRouter: require('./middleware/empty_middleware'),
    swaggerMetadata: require('./middleware/empty_middleware'),
    swaggerUi: require('./middleware/empty_middleware'),
    swaggerSecurity: require('./middleware/empty_middleware')
  };
  callback(middleware);
  registerPaths(fullSchema, app);
};

module.exports = {
  initialize: initialize,
  initializeMiddleware: initializeMiddleware,
  configure: configure,
};
