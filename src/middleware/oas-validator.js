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
 * Returns the oas-like version of the url requested by the user.
 * @param {string} path - Express version of the requested url: req.route.path.
 */
function getOASversion(path) {
  var oasVersion = "";
  var hasParameters = false;
  for (var c in path) {
    if (path[c] == ':') {
      hasParameters = true;
      oasVersion += '{';
    } else if (path[c] == '/' && hasParameters == true) {
      oasVersion += '}/';
    } else {
      oasVersion += path[c];
    }
  }
  if (hasParameters == true) {
    oasVersion += '}';
  }
  return oasVersion;
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
 * @param {string} requestedSpecPath - Requested url by the client. If the request had parameters in the query those won't be part of this variable.
 * @param {string} method - Method requested by the client.
 * @param {string} req - The whole req object from the client request.
 */
function checkRequestData(paths, requestedSpecPath, method, res, req, callback) {
  var missingOrWrongParameters = [];
  var missingParameters = [];
  var wrongParameters = [];

  if (paths[requestedSpecPath][method].hasOwnProperty('requestBody')) {
    var requestBody = paths[requestedSpecPath][method]['requestBody'];

    if (requestBody.required.toString() == 'true') { //TODO: in case it is not required...there is no validation?
      if (req.body == undefined || JSON.stringify(req.body) == '{}') {
        var msg = "Missing object in the request body";
        if (config.strict == true) {
          logger.error(msg);
          res.status(400).send({ //TODO: it must send bad request
            message: msg
          });
        } else {
          logger.warning(msg);
        }
      } else {
        var validSchema = requestBody.content['application/json'].schema;
        var data = req.body; //JSON.parse(req.body); //Without this everything is string so type validation wouldn't happen

        var err = validator.validate(data, validSchema);
        //validator.validate(data, validSchema, function(err, valid) {
        if (err == false) {
          if (Array.isArray(err)) {
            err = err[0];
          }
          var msg = "Wrong data in the body of the request: " + validator.getLastError();;
          if (config.strict == true) {
            logger.error(msg);
            res.status(400).send({ //TODO: it must send bad request
              message: msg
            });
          } else {
            logger.warning(msg);
          }
        } else {
          logger.info("Valid parameter on request");
        }
        //});
      }
    }
  }

  if (paths[requestedSpecPath][method].hasOwnProperty('parameters')) {
    var params = paths[requestedSpecPath][method]['parameters'];

    for (var i = 0; i < params.length; i++) {

      if (params[i].required.toString() == 'true') { //TODO: in case it is not required...there is no validation?
        var name = params[i].name;
        var location = params[i].in;
        var schema = params[i].schema;

        location = locationFormat(location);
        if (req[location][name] == undefined) { //if the request is missing a required parameter acording to the oasDoc: warning
          var msg = "Missing parameter " + name + " in " + location;
          if (config.strict == true) {
            logger.error(msg);
            res.status(400).send({ //TODO: it must send bad request
              message: msg
            });
          } else {
            logger.warning(msg);
          }
        } else { // In case the parameter is indeed present, check type. In the case of array, check also type of its items!
          try {
            var value = JSON.parse(req[location][name]);
          } catch (err) {
            var value = new String(req[location][name]);
          }
          var err = validator.validate(value, schema);
          //validator.validate(value, schema, function(err, valid) {
          if (err == false) {
            if (Array.isArray(err)) {
              err = err[0];
            }
            if (err.code == "UNKNOWN_FORMAT") {
              var registeredFormats = ZSchema.getRegisteredFormats();
              logger.info("UNKNOWN_FORMAT error - Registered Formats: ");
              logger.info(registeredFormats);
            }
            var msg = "Wrong parameter " + name + " in " + location + ": " + validator.getLastError();
            if (config.strict == true) {
              logger.error(msg);
              res.status(400).send({ //TODO: it must send bad request
                message: msg
              });
            } else {
              logger.warning(msg);
            }
          } else {
            logger.info("Valid parameter on request");
          }
          //});
        }
      }
    }
  }
  callback();
}

exports = module.exports = function(oasDoc, appRoutes) {

  return function OASValidator(req, res, next) {

    var method = req.method.toLowerCase();

    logger.info("Requested method-url pair: " + method + " - " + req.url);

    var requestedSpecPath = getOASversion(req.route.path);

    res.locals.requestedSpecPath = requestedSpecPath;
    checkRequestData(oasDoc.paths, requestedSpecPath, method, res, req, function() {
      res.locals.oasDoc = oasDoc;
      next();
    });
  }
}
