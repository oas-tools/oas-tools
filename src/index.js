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
 * Returns a simple, frinedly, intuitive name deppending on the requested method.
 * @param {object} method - Method name taken directly from the req object.
 */
function nameMethod(method) {
  method = method.toString();
  var name;
  if (method == 'GET') {
    name = "list";
  } else if (method == 'POST') {
    name = "create";
  } else if (method == 'PUT') {
    name = "update";
  } else {
    name = "delete";
  }
  return name;
}

/**
 * Checks if operationId (or generic) exists for a given pair path-method.
 *@param {object} load - .
 *@param {object} pathName - .
 *@param {object} methodName - .
 *@param {object} methodSection - .
 */
function checkOperationId(load,pathName,methodName,methodSection){
  if(methodSection.operationId != undefined && load[methodSection.operationId] == undefined){
    logger.error("      There is no function in the controller for " + methodName.toUpperCase() + " - " + pathName);
    process.exit();
  }else{
    var opId = nameMethod(methodName) + pathName.split("/")[1];
    if(load[methodSection.operationId] == undefined){
      logger.error("      There is no function in the controller for " + methodName.toUpperCase() + " - " + pathName);
      process.exit();
    }
    else{
      logger.debug("      Controller for " + methodName.toUpperCase() + " - " + pathName + ": OK");
    }
  }
}

/**
 * Checks if exists controller for a given pair path-method.
 *@param {object} pathName - Path to transform.
 *@param {object} methodName - Path to transform.
 *@param {object} methodSection - Path to transform.
 *@param {object} controllersLocation - Path to transform.
 */
function checkControllers(pathName,methodName,methodSection,controllersLocation){
  logger.debug("  "+methodName.toUpperCase() + " - " + pathName);
  var controller;
  var load;
  if(methodSection['x-router-controller'] != undefined){
    controller = methodSection['x-router-controller'];
    logger.debug("    OAS-doc has x-router-controller property");
    try{
      load = require(pathModule.join(controllersLocation,controller));
      checkOperationId(load,pathName,methodName,methodSection);
    }catch(err){
      logger.error(err);
      process.exit();
    }
  }else{
    logger.debug("    OAS-doc doesn't have x-router-controller property -> try generic controller name")
    controller = pathName.split("/")[1] + "Controller"; //generate name and try to load it
    try{
      var load = require(pathModule.join(controllersLocation, controller));
      checkOperationId(load,pathName,methodName,methodSection);
    }catch(err){
      logger.debug("    Controller with generic controller name wasn't found either -> try Default one");
      try{
        controller = 'Default'//try to load default one
        var load = require(pathModule.join(controllersLocation, controller));
        checkOperationId(load,pathName,methodName,methodSection);
      }catch(err){
        logger.error("    There is no controller for " + methodName.toUpperCase() + " - " + pathName);
        process.exit();
      }
    }
  }
}

/**
 * Function to initialize OAS-tools middlewares.
 *@param {object} options - Parameter containing controllers location, Specification file, and others.
 *@param {function} callback - Function that initializes middlewares one by one in the index.js file.
 */
var initialize = function initialize(oasDoc, app, callback) {

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

  var schemaV3 = fs.readFileSync(pathModule.join(__dirname, './schemas/openapi-3.0.json'), 'utf8');
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
    logger.debug("Checking that controllers exist indeed:");
    for (var path in paths) {
      for (var method in paths[path]) {
        checkControllers(path,method,paths[path][method],config.controllers);
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

/**
 * Function to initialize swagger-tools middlewares.
 *@param {object} specDoc - Specification file.
 *@param {function} callback - Function that initializes middlewares one by one in the index.js file.
 */
 var initializeMiddleware = function initializeMiddleware(specDoc, callback) {
    //spec = specDoc;

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

    var schemaV3 = fs.readFileSync(pathModule.join(__dirname, './schemas/openapi-3.0.json'), 'utf8');
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
  initialize: initialize,
  initializeMiddleware: initializeMiddleware,
  configure: configure,
};
