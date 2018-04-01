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
var ZSchema = require("z-schema");
var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');
var http = require('http');
var urlModule = require('url');
var config = require('../configurations'),
  logger = config.logger;
var deref = require('json-schema-deref');
var validator = new ZSchema({
  ignoreUnresolvableReferences: true,
  ignoreUnknownFormats: config.ignoreUnknownFormats
});

/**
 * Returns the OAS version of a Express-like path.
 * @param {object} path - Path in Express format.
 */
function getOASversion(path) {
  var oasVersion = "";
  for (var c in path) {
    if (path[c] == ':') {
      oasVersion = oasVersion + '{';
    } else {
      oasVersion = oasVersion + path[c];
    }
  }
  return oasVersion + '}';
}

/**
 * Checks whether the provided specification file contains the requested url in the req value.
* If it contains it, then it must be checked whether the requested method is specified in the specification for that requested url.
 * If this requested peer has a match in the specification file then this function returns this matching path, otherwise it must return undefined.
 * @param {object} paths - Portion of code in yaml containing the path section from the oasDoc file.
 * @param {string} requestedUrl - Requested url by the client. If the request had parameters in the query those won't be part of this variable.
 * @param {string} method - Method requested by the client.
 * @param {string} appRoutes - Registered routes.
 * @param {string} params - Params on the requested url.
 */
function specContainsPath(paths, requestedUrl, method, appRoutes, params) {
  logger.info("Requested method-url pair: " + method + " - " + requestedUrl);
  var requestedSpecPath = undefined;
  if (paths.hasOwnProperty(requestedUrl)) {
    if (paths[requestedUrl].hasOwnProperty(method)) {
      requestedSpecPath = requestedUrl;
    }
  } else {
    for (var i = 0; i < appRoutes.length; i++) { //loop over all the paths in the oasDoc
      if (appRoutes[i].route != undefined) {
        try {
          logger.info(appRoutes[i].route.stack[0].method + " -> " + appRoutes[i].route.path + " -> " + appRoutes[i].keys[0].name);
          if (Object.keys(appRoutes[i].keys[0]).length == Object.keys(params).length + 2) {
            if (appRoutes[i].route.stack[0].method == method) {
              requestedSpecPath = getOASversion(appRoutes[i].route.path);
              break;
            }
          }
        } catch (err) {
          logger.info(appRoutes[i].route.stack[0].method + " -> " + appRoutes[i].route.path + " -> (no parameters)");
        }
      }
    }
  }
  return requestedSpecPath;
}

/**
 * Returns the Express version of the OAS name for location.
 * @param {string} location - Location of a parameter. 'in' of the oasDoc file for that parameter.
 */
function locationFormat(location) {
  var expressLocation = location;
  if (location == "path") {
    expressLocation = "params";
  }
  return expressLocation;
}

/**
 * Checks if the data provided in the request is valid acording to what is specified in the oas specification file.
 * @param {object} paths - Paths section of the oasDoc file.
 * @param {string} requestedUrl - Requested url by the client. If the request had parameters in the query those won't be part of this variable.
 * @param {string} method - Method requested by the client.
 * @param {string} req - The whole req object from the client request.
 */
function checkRequestData(paths, requestedUrl, method, req) {
  var missingOrWrongParameters = [];
  var missingParameters = [];
  var wrongParameters = [];
  if (paths[requestedUrl][method].hasOwnProperty('parameters')) {
    var params = paths[requestedUrl][method]['parameters'];
    for (var i = 0; i < params.length; i++) {

      if (params[i].required.toString() == 'true') {
        var name = params[i].name;
        var location = params[i].in;
        var schema = params[i].schema;

        location = locationFormat(location);

        if (req[location][name] == undefined) { //if the request is missing a required parameter acording to the oasDoc: warning
          missingParameters.push([name, location]);
        }
        else { // In case the parameter is indeed present, check type. In the case of array, check also type of its items!
          try {
            var value = JSON.parse(req[location][name]);
          } catch (err) {
            var value = new String(req[location][name]);
          }
          validator.validate(value, schema, function(err, valid) {
            if (err) {
              wrongParameters.push(name);
              if (Array.isArray(err)) {
                err = err[0];
              }
              if (err.code == "UNKNOWN_FORMAT") {
                var registeredFormats = ZSchema.getRegisteredFormats();
                logger.info("UNKNOWN_FORMAT error - Registered Formats: ");
                logger.info(registeredFormats);
              }
              console.log(err)
              throw new Error(err.message);
            }
            else {
              logger.info("Valid parameter on request");
            }
          });
        }
      }
    }
  }
  missingOrWrongParameters.push(missingParameters);
  missingOrWrongParameters.push(wrongParameters);
  return missingOrWrongParameters;
}

/**
 * Returns a string containing all the warnings/errors from the validation.
 * @param {object} missingOrWrongParameters - Array containing the missing and wrong parameters on the request acording to the specification file.
 */
function errorsToString(missingOrWrongParameters) {
  var msg = "";
  if (missingOrWrongParameters[0].length > 0) {
    msg = msg + "The following parameters were required but weren't sent in the request: " + missingOrWrongParameters[0];
  }
  if (missingOrWrongParameters[1].length > 0) {
    msg = msg + "\nThe following parameters were not of the right type: " + missingOrWrongParameters[1];
  }
  return msg;
}


exports = module.exports = function(oasDoc, appRoutes) {

  return function OASValidator(req, res, next) {

    var requestedUrl = req.url.split("?")[0]; //allows requests with parameters in the query
    res.locals.requestedUrl = requestedUrl;
    var method = req.method.toLowerCase();
    var requestedSpecPath = specContainsPath(oasDoc.paths, requestedUrl, method, appRoutes, req.params);

    if (requestedSpecPath != undefined) { //In case the oasDoc file contains the requested pair method-url: validate the request parameters
      res.locals.requestedSpecPath = requestedSpecPath;
      var missingOrWrongParameters = checkRequestData(oasDoc.paths, requestedSpecPath, method, req);
      var msg = errorsToString(missingOrWrongParameters);
      if (msg.length > 0) {
        if (config.strict == true) {
          logger.error(msg);
          res.status(400).send({
            message: msg
          });
        } else {
          logger.warning(msg);
          res.locals.oasDoc = oasDoc;
          next();
        }
      } else {
        res.locals.oasDoc = oasDoc;
        next();
      }
    } else { //In case the requested url is not in the oasDoc file, inform the user
      logger.warning("The requested path is not in the specification file");
      res.status(404).send({
        message: "The requested path is not in the specification file"
      });
    }
  }
}
