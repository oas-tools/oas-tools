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
  ignoreUnresolvableReferences: true
});
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
 * Returns a simple, frinedly, intuitive name deppending on the requested method.
 * @param {object} method - Method name taken directly from the req object.
 */
function nameMethod(method) {
  method = method.toString();
  var name;
  if (method == 'get') {
    name = "list";
  } else if (method == 'post') {
    name = "create";
  } else if (method == 'put') {
    name = "update";
  } else if (method == 'delete') {
    name = "delete";
  }
  return name;
}

/** TODO: for paths like /2.0/votos/{talkId}/ swagger creates 2_0votosTalkId que no es válido! qué debe hacer oas-tools?
 * Generates an operationId according to the method and path requested the same way swagger-codegen does it.
 * @param {string} method - Requested method.
 * @param {string} path - Requested path as shown in the oas doc.
 */
function generateOperationId(method, path) {
  var output = "";
  var path = path.split('/');
  for (var i = 1; i < path.length; i++) {
    var chunck = path[i].replace(/[{}]/g, '');
    output = output + chunck.charAt(0).toUpperCase() + chunck.slice(1, chunck.length);
  }
  output = output + method.toUpperCase();
  return output.charAt(0).toLowerCase() + output.slice(1, output.length);
}

/**
 * OperationId can have values which are not accepted as function names. This function generates a valid name
 * @param {object} operationId - OpreationId of a given path-method pair.
 */
function normalize(operationId) {
  if (operationId != undefined) {
    var validOpId = "";
    for (var i = 0; i < operationId.length; i++) {
      if (operationId[i] == '-') {
        validOpId = validOpId + "";
        validOpId = validOpId + operationId[i + 1].toUpperCase();
        i = i + 1;
      } else {
        validOpId = validOpId + operationId[i];
      }
    }
    return validOpId;
  } else {
    return undefined;
  }
}

/**
 * Checks if operationId (or generic) exists for a given pair path-method.
 *@param {object} load - Loaded controller.
 *@param {object} pathName - Path of the spec file to be used to find controller.
 *@param {object} methodName - One of CRUD methods.
 *@param {object} methodSection - Section of the speficication file belonging to methodName.
 */
function checkOperationId(load, pathName, methodName, methodSection) {
  var opId;

  if (normalize(methodSection.operationId) != undefined && load[normalize(methodSection.operationId)] == undefined) {
    logger.error("      There is no function in the controller for " + methodName.toUpperCase() + " - " + pathName + " (operationId: " + methodSection.operationId + ")");
    process.exit();
  } else {
    if (load[normalize(methodSection.operationId)] != undefined) {
      opId = normalize(methodSection.operationId);
    } else {
      opId = generateOperationId(methodName, pathName);
      logger.debug("      There is no operationId for " + methodName.toUpperCase() + " - " + pathName + " -> generated: " + opId);
    }
    if (load[opId] == undefined) {
      logger.error("      There is no function in the controller for " + methodName.toUpperCase() + " - " + pathName + " (operationId: " + opId + ")");
      process.exit();
    } else {
      logger.debug("      Controller for " + methodName.toUpperCase() + " - " + pathName + ": OK");
    }
  }
}

/**
 * Removes parameters from the requested path and returns the base path.
 * TODO: with first character converted to upper case as it will be used for a controller name.?
 * @param {string} reqRoutePath - Value or req.route.path (express version).
 */
function getBasePath(reqRoutePath) {
  var basePath = "";
  var first = true;
  var path_array = reqRoutePath.split('/');
  for (var i = 0; i < path_array.length; i++) {
    if (path_array[i].charAt(0) !== ':' && first == true && path_array[i].charAt(0) !== '') {
      basePath = basePath + path_array[i];
      first = false;
    } else if (path_array[i].charAt(0) !== ':') {
      basePath = basePath + path_array[i].charAt(0).toUpperCase() + path_array[i].slice(1, path_array[i].length);
    }
  }
  return basePath; //basePath.charAt(0).toUpperCase() + basePath.slice(1, basePath.length);
}

/**
 * Converts a oas-doc type path into an epxress one.
 * @param {string} oasPath - Path as shown in the oas-doc.
 */
function getExpressVersion(oasPath) {
  return oasPath.replace(/{/g, ':').replace(/}/g, '');
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
    controller = getBasePath(getExpressVersion(pathName)) + "Controller"; //TODO: update this! the way swagger does it: path+params+method.toUpperCase();
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
 * Function to initialize OAS-tools middlewares.
 *@param {object} oasDoc - Specification file.
 *@param {object} app - Express server used for the application. Needed to register the paths.
 *@param {function} callback - Function in which the app is started.
 */
var initialize = function initialize(oasDoc, app, callback) {

  init_checks(oasDoc, callback);

  var fullSchema = deref(oasDoc);
  logger.info("Specification file dereferenced");
  oasDoc = fullSchema;

  var OASRouterMid = function() {
    var OASRouter = require('./middleware/oas-router');
    return OASRouter.call(undefined, config.controllers); // ROUTER NEEDS JUST CONTROLLERS
  };
  var OASValidatorMid = function() {
    var OASValidator = require('./middleware/oas-validator');
    return OASValidator.call(undefined, oasDoc, app._router.stack); // VALIDATOR NEEDS JUST SPEC-FILE
  };

  var paths = oasDoc.paths;
  for (var path in paths) {
    for (var method in paths[path]) {
      var expressPath = transformToExpress(path);
      logger.debug("Register: " + method.toUpperCase() + " - " + expressPath);
      if (config.router == true) {
        checkControllers(path, method, paths[path][method], config.controllers);
      }
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
  specDoc = fullSchema;

  var OASRouterMid = function() {
    var OASRouter = require('./middleware/oas-router');
    return OASRouter.call(undefined, config.controllers); // ROUTER NEEDS JUST CONTROLLERS
  };
  var OASValidatorMid = function() {
    var OASValidator = require('./middleware/oas-validator');
    return OASValidator.call(undefined, specDoc); // VALIDATOR NEEDS JUST SPEC-FILE
  };

  var paths = specDoc.paths;
  for (var path in paths) {
    for (var method in paths[path]) {
      var expressPath = transformToExpress(path);
      logger.debug("Register: " + method.toUpperCase() + " - " + expressPath);
      if (config.router == true) {
        checkControllers(path, method, paths[path][method], config.controllers);
      }
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
  var middleware = {
    /* swaggerValidator: function() {
      var OASValidator = require('./middleware/oas-validator');
      return OASValidator.call(undefined, specDoc); // VALIDATOR NEEDS JUST SPEC-FILE
    },
    swaggerRouter: function() {
      var OASRouter = require('./middleware/oas-router');
      return OASRouter.call(undefined, config.controllers); // ROUTER NEEDS JUST CONTROLLERS
    }, */
    swaggerValidator: require('./middleware/empty_middleware'),
    swaggerRouter: require('./middleware/empty_middleware'),
    swaggerMetadata: require('./middleware/empty_middleware'),
    swaggerUi: require('./middleware/empty_middleware'),
    swaggerSecurity: require('./middleware/empty_middleware')
  };
  callback(middleware);
};

module.exports = {
  initialize: initialize,
  initializeMiddleware: initializeMiddleware,
  configure: configure,
};
