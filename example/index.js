'use strict';

var fs = require('fs'), path = require('path'), http = require('http');

var express = require("express");
var app = express();
var oasTools = require('../src/index.js'); //src folder, not inside node-modules
//var oasTools = require('oas-tools'); //Use this once the module is inside node_modules
var jsyaml = require('js-yaml');
var serverPort = 8383;

var options = {controllers : path.join(__dirname, './controllers')};//tells the router where the controllers are. Router middleware should check on the spec file which one to use
var spec = fs.readFileSync(path.join(__dirname, 'oai-spec.yaml'), 'utf8'); /*works well with both json and yaml...why? */
var specDoc = jsyaml.safeLoad(spec);

//validate spec file and initialize middlewares
oasTools.initializeMiddleware(specDoc, function (middleware) {
  // Validate incoming requests
  app.use(middleware.OASValidator(specDoc));

  // Route validated requests to appropriate controller
  app.use(middleware.OASRouter(options));

  // Start the server
  http.createServer(app).listen(serverPort, function() {
    console.log("App running at http://localhost:"+serverPort);
  });

});
