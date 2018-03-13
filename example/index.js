'use strict';

var fs = require('fs'), path = require('path'), http = require('http');

var express = require("express");
var app = express();
var oasTools = require('../src/index.js'); //src folder, not inside node-modules
//var oasTools = require('oas-tools'); //Use this once the module is inside node_modules
var jsyaml = require('js-yaml');
var serverPort = 8383;

var spec = fs.readFileSync(path.join(__dirname, 'oai-spec.yaml'), 'utf8');
var oasDoc = jsyaml.safeLoad(spec);

//  -string: then it is the locations of a file containing all the configurations (controllers, enable logs, strict check...)
var options_string = './configurations/customConfig.yaml';

//  -object: then it is an object that follows the structure of a config file and has all the setConfigurations
var options_object = {controllers : path.join(__dirname, './controllers'),
              enableLogs: false,
              strict: false
            };

//  -if the user doesnt define these options, then the default config file must be used.

oasTools.configure(options_object); //this is optional! User is not forced to use apply this, SO THIS DOESN'T CONTAIN THE SPEC-FILE!

//validate spec file and initialize middlewares
oasTools.initializeMiddleware(oasDoc, function (middleware) {
  // Validate incoming requests
  app.use(middleware.OASValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.OASRouter());

  // Start the server
  http.createServer(app).listen(serverPort, function() {
    console.log("App running at http://localhost:"+serverPort);
    console.log("________________________________________________________________"); // separates initialization loggs and app execution loggs
  });

});
