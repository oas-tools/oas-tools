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
var validator = new ZSchema({
  ignoreUnresolvableReferences: true,
  ignoreUnknownFormats: config.ignoreUnknownFormats,
  breakOnFirstError: false
});
var _ = require('lodash-compat');


/**
 * Returns the Express version of the OAS name for location.
 * @param {string} inProperty - Location of a parameter, value of 'in' property of the oasDoc file for that parameter.
 */
function locationFormat(inProperty) { //TODO: Possible 'in' values: path, query, header, cookie.
  var dict = {
    path: "params",
    query: "query",
    header: "header",
    cookie: "cookie"
  };
  return dict[inProperty];
  //return (inProperty == "path" ? "params" : inProperty); //TODO: if only 'path' changes then this is the solution!
}

/**
 * Checks if the data provided in the request is valid acording to what is specified in the oas specification file.
 * @param {object} paths - Paths section of the oasDoc file.
 * @param {string} requestedSpecPath - Requested url by the client. If the request had parameters in the query those won't be part of this variable.
 * @param {string} method - Method requested by the client.
 * @param {string} req - The whole req object from the client request.
 */
function checkRequestData(oasDoc, requestedSpecPath, method, res, req, next) {
  var paths = oasDoc.paths;
  var keepGoing = true;
  var msg = "";
  var missingOrWrongParameters = [];
  var missingParameters = [];
  var wrongParameters = [];

  if (paths[requestedSpecPath][method].hasOwnProperty('requestBody')) {
    var requestBody = paths[requestedSpecPath][method]['requestBody'];
    if (requestBody.required != undefined && requestBody.required.toString() == 'true') { //TODO: in case it is not required...there is no validation?
      if (req.body == undefined || JSON.stringify(req.body) == '{}') {
        msg += "Missing object in the request body. ";
        keepGoing = false;
      } else {
        var validSchema = requestBody.content['application/json'].schema;
        var data = req.body; //JSON.parse(req.body); //Without this everything is string so type validation wouldn't happen
        var err = validator.validate(data, validSchema);
        if (err == false) {
          keepGoing = false;
          msg += "Wrong data in the body of the request: " + JSON.stringify(validator.getLastErrors()) + ". ";
        } else {
          logger.info("Valid parameter on request");
        }
      }
    }
  }

  if (paths[requestedSpecPath][method].hasOwnProperty('parameters')) {

    var params = paths[requestedSpecPath][method]['parameters'];

    for (var i = 0; i < params.length; i++) {

      //TODO: 'required' property is not required, some parameters may not have it (those in query for example)

      if (params[i].required != undefined && params[i].required.toString() == 'true') { //TODO: in case it is not required...there is no validation?
        var name = params[i].name;
        var location = params[i].in;
        var schema = params[i].schema;

        location = locationFormat(location);
        if (req[location][name] == undefined) { //if the request is missing a required parameter acording to the oasDoc: warning
          msg += "Missing parameter " + name + " in " + location + ". ";
          keepGoing = false;
        } else { // In case the parameter is indeed present, check type. In the case of array, check also type of its items!
          try {
            var value = JSON.parse(req[location][name]);
          } catch (err) {
            var value = req[location][name] + ""; //new String(req[location][name]);
          }
          var err = validator.validate(value, schema);
          if (err == false) {
            keepGoing = false;
            if (err.code == "UNKNOWN_FORMAT") {
              var registeredFormats = ZSchema.getRegisteredFormats();
              logger.error("UNKNOWN_FORMAT error - Registered Formats: ");
              logger.error(registeredFormats);
            }
            msg += "Wrong parameter " + name + " in " + location + ": " + JSON.stringify(validator.getLastErrors()) + ". ";
          } else {
            logger.info("Valid parameter on request");
          }
        }
      }
    }
  }
  if (keepGoing == false && config.strict == true) {
    logger.error(msg);
    res.status(400).send({
      message: msg
    })
  } else {
    if (msg.length != 0) {
      logger.warning(msg);
    }
    res.locals.oasDoc = oasDoc;
    next();
  }
}

/**
 * .
 * @param {string}  - .
 */
function getParameterType(schema) {
  var type = schema.type;
  if (!type && schema.schema) {
    type = getParameterType(schema.schema);
  }
  if (!type) {
    type = 'object';
  }
  return type;
};

/**
 * .
 * @param {string}  - .

function getParameterValue(req, parameter){ //TODO handle: body, form, formData, header, path, query... what about body?
  var parameterName = parameter.name;
  return req.params[parameterName];
}
*/
function getParameterValue(req, parameter) {
  var defaultVal = parameter.default;
  var paramLocation = parameter.in;
  var paramType = getParameterType(parameter);
  var val;

  // Get the value to validate based on the operation parameter type
  switch (paramLocation) {
    case 'body':
      val = req.body;

      break;
    case 'form':
    case 'formData':
      if (paramType.toLowerCase() === 'file') {
        if (_.isArray(req.files)) {
          val = _.find(req.files, function(file) {
            return file.fieldname === parameter.name;
          });
        } else if (!_.isUndefined(req.files)) {
          val = req.files[parameter.name] ? req.files[parameter.name] : undefined;
        }

        // Swagger does not allow an array of files
        if (_.isArray(val)) {
          val = val[0];
        }
      } else if (isModelParameter(version, parameter)) {
        val = req.body;
      } else {
        val = req.body[parameter.name];
      }

      break;
    case 'header':
      val = req.headers[parameter.name.toLowerCase()];

      break;
    case 'path':
      val = req.params[parameter.name]; // TODO: how many parameters can be in the path?

      break;
    case 'query':
      val = _.get(req.query, parameter.name);

      break;
  }
  // Use the default value when necessary
  if (_.isUndefined(val) && !_.isUndefined(defaultVal)) {
    val = defaultVal;
  }

  return val;
};

/**
 * .
 * @param {string}  - .
 */
function convertValue(value, schema, type) {
  var original = value;

  // Default to {}
  if (_.isUndefined(schema)) {
    schema = {};
  }

  // Try to find the type or default to 'object'
  if (_.isUndefined(type)) {
    type = getParameterType(schema);
  }

  // If there is no value, do not convert it
  if (_.isUndefined(value)) {
    return value;
  }

  // If there is an empty value and allowEmptyValue is true, return it
  if (schema.allowEmptyValue && value === '') {
    return value;
  }

  switch (type) {
    case 'array':
      if (_.isString(value)) {
        switch (schema.collectionFormat) {
          case 'csv':
          case undefined:
            try {
              value = JSON.parse(value);
            } catch (err) {
              value = original;
            }

            if (_.isString(value)) {
              value = value.split(',');
            }
            break;
          case 'multi':
            value = [value];
            break;
          case 'pipes':
            value = value.split('|');
            break;
          case 'ssv':
            value = value.split(' ');
            break;
          case 'tsv':
            value = value.split('\t');
            break;
        }
      }

      // Handle situation where the expected type is array but only one value was provided
      if (!_.isArray(value)) {
        value = [value];
      }

      value = _.map(value, function(item, index) {
        var iSchema = _.isArray(schema.items) ? schema.items[index] : schema.items;

        return convertValue(item, iSchema, iSchema ? iSchema.type : undefined);
      });

      break;

    case 'boolean':
      if (!_.isBoolean(value)) {
        if (['false', 'true'].indexOf(value) === -1) {
          value = original;
        } else {
          value = value === 'true' || value === true ? true : false;
        }
      }

      break;

    case 'integer':
      if (!_.isNumber(value)) {
        if (_.isString(value) && _.trim(value).length === 0) {
          value = NaN;
        }

        value = Number(value);

        if (isNaN(value)) {
          value = original;
        }
      }

      break;

    case 'number':
      if (!_.isNumber(value)) {
        if (_.isString(value) && _.trim(value).length === 0) {
          value = NaN;
        }

        value = Number(value);

        if (isNaN(value)) {
          value = original;
        }
      }

      break;

    case 'object':
      if (_.isString(value)) {
        try {
          value = JSON.parse(value);
        } catch (err) {
          value = original;
        }
      }

      break;

    case 'string':
      if (['date', 'date-time'].indexOf(schema.format) > -1 && !_.isDate(value)) {
        value = new Date(value);

        if (!_.isDate(value) || value.toString() === 'Invalid Date') {
          value = original;
        }
      }

      break;

  }

  return value;
};


exports = module.exports = function(oasDoc) {

  return function OASValidator(req, res, next) {

    var method = req.method.toLowerCase();

    logger.info("Requested method-url pair: " + method + " - " + req.url);

    var requestedSpecPath = config.pathsDict[req.route.path];

    req.swagger = {
      params: {}
    }

    var parameters = oasDoc.paths[requestedSpecPath][method]['parameters'];
    if(parameters != undefined){
      parameters.forEach(function(parameter) { // TODO: para POST y PUT el objeto se define en 'requestBody' y no en 'parameters'
        var pType = getParameterType(parameter);
        var oVal = getParameterValue(req, parameter);
        var value = convertValue(oVal, parameter.schema == undefined ? parameter : parameter.schema, pType);

        req.swagger.params[parameter.name] = {
          path: "/some/path", //this shows the path to follow on the spec file to get to the parameter but oas-tools doesn't use it!
          schema: parameter,
          originalValue: oVal,
          value: value
        };
      });
    }

    var requestBody = oasDoc.paths[requestedSpecPath][method]['requestBody'];
    if(requestBody != undefined){
        req.swagger.params[requestBody['x-name']] = {
          path: "/some/path", //this shows the path to follow on the spec file to get to the parameter but oas-tools doesn't use it!
          schema: requestBody.content['application/json'].schema,
          originalValue: req.body,
          value: req.body
        };
    }

    res.locals.requestedSpecPath = requestedSpecPath;
    checkRequestData(oasDoc, requestedSpecPath, method, res, req, next);
  }
}
