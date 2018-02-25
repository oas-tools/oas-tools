'use strict';

var exports;
var path = require('path');
var ZSchema = require("z-schema");
var logger = require('../logger/logger');
var validator = new ZSchema({
  ignoreUnresolvableReferences: true,
  ignoreUnknownFormats: true
});

var controllers;

/**
 * Executes a function whose name is stored in a string value
 * @param {string} functionName - Name of the function to be executed.
 * @param {string} context - Location of the function to be executed.
 * @param {string} req - Request object (necessary for the execution of the controller).
 * @param {string} res - Response object (necessary for the execution of the controller).
 * @param {string} next - Express middleware next function (necessary for the execution of the controller).
 */
function executeFunctionByName(functionName, context, req, res, next) {
  logger.info("-------------------log DENTRO de executeFunctionByName");
  var args = Array.prototype.slice.call(arguments, 3);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for (var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, [req, res, next]);
}

/**
 * This function resolves the references ($ref) inside the specification file, but only when these are on the same file.
 * @param {object} spec - Specification file.
 * @param {object} location - Reference on the spec file, indicating where the necessary schema is on it.
 */
function referencedSchema(spec, location) {
  var initialSpec = spec;
  location = (location.substring(2, location.length)).split("/"); //removes the dash at the beggining of the string and separates by '/'
  for(var i = 0;i<location.length;i++){
    if(i==location.length){
      break;
    }else{
      spec = spec[location[i].toString()];
    }
  }
  var res = spec;
  if(res.items != undefined) { //If it has 'items' then it means the base spot hasn't been reached and there are more $ref's
    res = referencedSchema(initialSpec, res.items['$ref']);
  }
  return res;
}

/**
 * Checks if the data sent as a response for the previous request matches the indicated in the specification file in the responses section for that request.
 * This function is used in the interception of the response sent by the controller to the client that made the request.
 * @param {object} code - Status code sent from the controller to the client.
 * @param {object} spec - Specification file.
 * @param {object} method - Method requested by the client.
 * @param {object} url - Requested path.
 * @param {object} data - Data sent from controller to client.
 */
function checkResponse(code, spec, method, url, data) {
  data = data[0];
  logger.info("Processing at checkResponse:");
  logger.info("  -code: " + code);
  logger.info("  -spec: " + spec);
  logger.info("  -method: " + method);
  logger.info("  -url: " + url);
  logger.info("  -data: " + data);
  var responseCodeSection = spec.paths[url][method].responses[code]; //Section of the spec file starting at a response code
  if (responseCodeSection == undefined) {
    logger.info("WARNING: wrong response code");
    logger.info(code);
  } else { //if the code is undefined, data wont be checked as to retrieve 'schema' from the spec file, a status code is needed!
    var validSchemaLocation = responseCodeSection.content['application/json'].schema['$ref'];
    var validSchema = referencedSchema(spec, validSchemaLocation);
    logger.info("schema to use to validate");
    validator.validate(data, validSchema, function(err, valid) {
      if (err) {
        logger.info("WARNING: wrong data in the response. " + err[0].message);
        logger.info(data);
      }
    });
  }
}

/**
 * Checks whether there is a standard controller (resouce+Controlle) in the location where the controllers are located or not.
 * @param {object} locationOfControllers - Location provided by the user where the controllers can be found.
 * @param {object} controllerName - Name of the controller: resource+Controller.
 */
function existsController(locationOfControllers, controllerName) {
  var load = require(path.join(locationOfControllers, controllerName));
  if (load == undefined) {
    return false;
  } else {
    return true;
  }
}

/**
 * Removes '/' from the requested url and returns a string representing the name (path) of the requested resource
 * @param {object} reqPath - Path containing '/' at the beggining.
 */
function nameOfPath(reqPath) {
  return reqPath.toString().substring(1, reqPath.length).toString();
}

/**
 * Removes '/' from the requested url and generates the standard name for controller: nameOfResource + "Controller"
 * @param {object} url - Url requested by the user, without parameters
 */
function generateName(url) {
  return nameOfPath(url) + "Controllers";
}

/**
 * Returns a simple, frinedly, intuitive name deppending on the requested method.
 * @param {object} method - method name taken directly from the req object.
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

exports = module.exports = function(options) {
  logger.info("Controller initialized at: " + options.controllers);
  return function OASRouter(req, res, next) {
    var spec = res.locals.spec;
    var url = res.locals.requestedUlr;
    var method = req.method.toLowerCase();

    var controllerName;
    if (spec.paths[url][method].hasOwnProperty('x-router-controller')) { //spec file has x-router-controllers property: use the controller specified there
      controllerName = spec.paths[url][method]['x-router-controller'];
      if (spec.paths[url][method].hasOwnProperty('operationId')) {
        var opID = spec.paths[url][method].operationId.toString(); // Use opID specified in the oas doc
      } else {
        var opID = nameMethod(spec.paths[url][method]) + nameOfPath(spec.paths[url][method]); //if there is no opID in the spec, then generate the identifier
      }
    } else if (existsController(options.controllers, generateName(url))) { //spec file doesn't have x-router-controllers property: use the standard controller name (autogenerated) if finded
      controllerName = generateName(url); //nameOfPath(spec.paths[url][method]).toString() + "Controller";
      if (spec.paths[url][method].hasOwnProperty('operationId')) {
        var opID = spec.paths[url][method].operationId.toString(); // Use opID specified in the oas doc
      } else {
        var opID = nameMethod(spec.paths[url][method]) + nameOfPath(spec.paths[url][method]); //if there is no opID in the spec, then generate the identifier
      }
    } else { //spec file doesn't have x-router-controllers property and standard controller (autogenerated name) doesn't exist: use the default controller
      controllerName = "Defualt";
      if (spec.paths[url][method].hasOwnProperty('operationId')) {
        var opID = spec.paths[url][method].operationId.toString(); // Use opID specified in the oas doc
      } else {
        var opID = nameMethod(spec.paths[url][method]) + nameOfPath(spec.paths[url][method]); //if there is no opID in the spec, then generate the identifier
      }
    }

    var controller = require(path.join(options.controllers, controllerName));

    var oldSend = res.send;
    res.send = function(data) { //intercept the response from the controller to check and validate it
      // arguments[0] (or `data`) contains the response body
      //arguments[0] = "new suff... "+arguments[0]; //With this line there is just one request, the way it should be! PROBLEM?
      arguments[0] = JSON.stringify(arguments[0]); //With this line, the problem of res.send being executed twice is avoided, check: https://stackoverflow.com/questions/41489528/why-is-res-send-being-called-twice
      checkResponse(res.statusCode, spec, method, url, arguments);
      oldSend.apply(res, arguments);
    }
    executeFunctionByName(opID, controller, req, res, next);
  }
}
