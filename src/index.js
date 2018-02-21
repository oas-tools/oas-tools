/*!
project-template-nodejs 0.0.0, built on: 2017-03-30
Copyright (C) 2017 ISA group
http://www.isa.us.es/
https://github.com/isa-group/project-template-nodejs

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
var ZSchema = require("z-schema");
var fs = require('fs');
var path = require('path');
var spec;
var debug = true;

/**
 * Auxiliar function to print data. Allows deactivation
 * @param {object} dataToPrint - Data to be printed using console.log.
 */
var loggerFunction = function loggerFunction(dataToPrint) {
  if (debug == true) {
    console.log(dataToPrint);
  }
}


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
      loggerFunction(err);
    } else {
      loggerFunction(valid);
    }
  });

  callback({
    OASRouter: require('./middleware/oas-router'),
    OASValidator: require('./middleware/oas-validator')
  });
};

module.exports = {
  initializeMiddleware: initializeMiddleware,
  loggerFunction: loggerFunction,
};
