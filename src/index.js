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
var path = require('js-yaml');
var logger;
var ZSchema = require("z-schema");
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
  console.log(options);
  customConfigurations = true;
  if (typeof options == 'string') { //in this case 'options' specifies the location of a custom config file
    try{
      var config = fs.readFileSync(path.join(__dirname, options), 'utf8');
      var options = jsyaml.safeLoad(config);
    }catch(err){
      console.log("The specified configuration file wasn't found at " +path.join(__dirname, options)+ ".  Default configurations will be set");
      setDefaultConfigurations();
    }
  }
  if (options.controllers != undefined) {
    //create local variable and use it for the router inside the callback at initializeMiddleware or create env variable?
    process.env.CTRLS = options.controllers;
    controllers = options.controllers;
  }
  if (options.enableLogs != undefined) {
    process.env.LOGS = options.enableLogs;
  }
  if (options.strict != undefined) {
    process.env.STRICT = options.strict;
  }
};

/**
 * Function to set default configurations. If the user doesn't specify configurations 'production' must be used
 */
function setDefaultConfigurations() {
  if (process.env.OAS_DEV == 'true') { //env variable development is set
    var configString = fs.readFileSync(path.join(__dirname, '/configurations/configs.yaml'), 'utf8');
    var newConfigurations = jsyaml.safeLoad(configString) //Isn't it enough with just the readFileSync line?
    configure(newConfigurations.development);
  } else { // env variable is set
    var configString = fs.readFileSync(path.join(__dirname, '/configurations/configs.yaml'), 'utf8');
    var newConfigurations = jsyaml.safeLoad(configString) //Isn't it enough with just the readFileSync line?
    configure(newConfigurations.production);
  }
}

/**
 * Function to initialize middlewares
 *@param {object} options - Parameter containing controllers location, Specification file, and others.
 *@param {function} callback - Function that initializes middlewares one by one in the index.js file.
 */
var initializeMiddleware = function initializeMiddleware(oasDoc, callback) {

  logger = require('./logger/logger'); //NOT DEFINITIVE SOLUTION!

  if (customConfigurations == false) {
    setDefaultConfigurations();
  }

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
      throw new Error('oasDoc is not valid: ');
      logger.info("Error: " + err);
    } else {
      logger.info("Valid specification file");
    }
  });

  callback({ //now this changes depending on whether the user used setConfiguration() or not!
    OASRouter: function() {
      var OASRouter = require('./middleware/oas-router');
      return OASRouter.call(undefined, controllers); // ROUTER NEEDS JUST CONTROLLERS
    },
    OASValidator: function() {
      var OASValidator = require('./middleware/oas-validator');
      return OASValidator.call(undefined, oasDoc); // VALIDATOR NEEDS JUST SPEC-FILE
    },
  });
};

module.exports = {
  initializeMiddleware: initializeMiddleware,
  configure: configure,
};
