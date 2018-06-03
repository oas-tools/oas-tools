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

var exports;
var path = require('path');
var ZSchema = require("z-schema");
var config = require('../configurations'),
  logger = config.logger;
var validator = new ZSchema({
  ignoreUnresolvableReferences: true,
  ignoreUnknownFormats: config.ignoreUnknownFormats,
  breakOnFirstError: false
});
var utils = require("../lib/utils.js");
var controllers;

/**
 * Executes a function whose name is stored in a string value.
 * @param {string} functionName - Name of the function to be executed.
 * @param {string} context - Location of the function to be executed.
 * @param {string} req - Request object (necessary for the execution of the controller).
 * @param {string} res - Response object (necessary for the execution of the controller).
 * @param {string} next - Express middleware next function (necessary for the execution of the controller).
 */
function executeFunctionByName(functionName, context, req, res, next) {
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for (var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  logger.debug("Processing at executeFunctionByName:");
  logger.debug("   -functionName: " + functionName);
  logger.debug("   -context[func]: " + func)
  return context[func].apply(context, [req, res, next]);
}


/**
 * Checks if the data sent as a response for the previous request matches the indicated in the specification file in the responses section for that request.
 * This function is used in the interception of the response sent by the controller to the client that made the request.
 * @param {object} res - res object of the request.
 * @param {object} oldSend - res object previous to interception.
 * @param {object} oasDoc - Specification file.
 * @param {object} method - Method requested by the client.
 * @param {object} requestedSpecPath - Requested path, as shown in the specification file: /resource/{parameter}
 * @param {object} content - Data sent from controller to client.
 */
function checkResponse(res, oldSend, oasDoc, method, requestedSpecPath, content) {
  var code = res.statusCode;
  var msg = [];
  var data = content[0];
  logger.debug("Processing at checkResponse:");
  logger.debug("  -code: " + code);
  logger.debug("  -oasDoc: " + oasDoc);
  logger.debug("  -method: " + method);
  logger.debug("  -requestedSpecPath: " + requestedSpecPath);
  logger.debug("  -data: " + data);
  var responseCodeSection = oasDoc.paths[requestedSpecPath][method].responses[code]; //Section of the oasDoc file starting at a response code
  if (responseCodeSection == undefined) { //if the code is undefined, data wont be checked as a status code is needed to retrieve 'schema' from the oasDoc file
    var newErr = {
      message: "Wrong response code: " + code
    }
    msg.push(newErr);
    if (config.strict == true) {
      logger.error(msg);
      content[0] = JSON.stringify(msg);
      oldSend.apply(res, content);
    } else {
      logger.warning(msg);
      oldSend.apply(res, content);
    }
  } else {
    if (responseCodeSection.hasOwnProperty('content')) { //if there is no content property for the given response then there is nothing to validate.
      var validSchema = responseCodeSection.content['application/json'].schema;
      logger.debug("Schema to use for validation: " + validSchema);
      data = JSON.parse(data); //Without this everything is string so type validation wouldn't happen
      var err = validator.validate(data, validSchema);
      if (err == false) {
        var newErr = {
          message: "Wrong data in the response. ",
          error: validator.getLastErrors(),
          content: data
        };
        msg.push(newErr);
        if (config.strict == true) {
          content[0] = JSON.stringify(msg);
          logger.error(content[0]);
          res.status(400);
          oldSend.apply(res, content);
        } else {
          logger.warning(msg + JSON.stringify(validator.getLastErrors()));
          oldSend.apply(res, content);
        }
      }else {
        oldSend.apply(res, content);
      }
    } else {
      oldSend.apply(res, content);
    }
  }
}

/**
 * Checks whether there is a standard controller (resouce+Controlle) in the location where the controllers are located or not.
 * @param {object} locationOfControllers - Location provided by the user where the controllers can be found.
 * @param {object} controllerName - Name of the controller: resource+'Controller'.
 */
function existsController(locationOfControllers, controllerName) {
  try {
    var load = require(path.join(locationOfControllers, controllerName));
    return true;
  } catch (err) {
    logger.info("The controller " + controllerName + " doesn't exist at " + locationOfControllers);
    return false;
  }
}

/**
 * Returns an operationId. The retrieved one from the specification file or an automatically generated one if it was not specified.
 * @param {object} oasDoc - Specification file.
 * @param {object} requestedSpecPath - Requested path as shown in the specification file.
 * @param {object} method - Requested method.
 */
function getOpId(oasDoc, requestedSpecPath, method) {
  if (oasDoc.paths[requestedSpecPath][method].hasOwnProperty('operationId')) {
    return utils.generateName(oasDoc.paths[requestedSpecPath][method].operationId.toString(), undefined); // Use opID specified in the oas doc
  } else {
    return utils.generateName(requestedSpecPath, "function") + method.toUpperCase();
  }
}


exports = module.exports = function(controllers) {
  return function OASRouter(req, res, next) {

    var oasDoc = res.locals.oasDoc;
    var requestedSpecPath = res.locals.requestedSpecPath; //requested path version on the oasDoc file of the requested url
    var method = req.method.toLowerCase();

    if (oasDoc.paths[requestedSpecPath][method].hasOwnProperty('x-swagger-router-controller')) { //oasDoc file has router_property: use the controller specified there
      var controllerName = oasDoc.paths[requestedSpecPath][method]['x-swagger-router-controller'];
    } else if (oasDoc.paths[requestedSpecPath][method].hasOwnProperty('x-router-controller')) { //oasDoc file has router_property: use the controller specified there
      var controllerName = oasDoc.paths[requestedSpecPath][method]['x-router-controller'];
    } else if (existsController(controllers, utils.generateName(requestedSpecPath, "controller"))){ //oasDoc file doesn't have router_property: use the standard controller name (autogenerated) if found
      var controllerName = utils.generateName(requestedSpecPath, "controller");
    } else { //oasDoc file doesn't have router_property and standard controller (autogenerated name) doesn't exist: use the default controller
      var controllerName = "Default";
    }

    var opID = getOpId(oasDoc, requestedSpecPath, method);

    try {
      var controller = require(path.join(controllers, controllerName));
    } catch (err) {
      logger.error("Controller not found: " + path.join(controllers, controllerName));
      process.exit();
    }

    var oldSend = res.send;
    res.send = function(data) { //intercept the response from the controller to check and validate it
      arguments[0] = JSON.stringify(arguments[0]); //Avoids res.send being executed twice: https://stackoverflow.com/questions/41489528/why-is-res-send-being-called-twice
      res.header("Content-Type", "application/json;charset=utf-8");
      checkResponse(res, oldSend, oasDoc, method, requestedSpecPath, arguments);
    }
    executeFunctionByName(opID, controller, req, res, next);
  }
}
