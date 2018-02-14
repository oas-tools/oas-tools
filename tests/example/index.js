'use strict';

console.log("Started application!");

var fs = require('fs'), path = require('path'), http = require('http');

var express = require("express");
var app = express();
var oasTools = require('oas-tools'); //folder already inside node-modules
var jsyaml = require('js-yaml');
var serverPort = 8383;

var options = {controllers : path.join(__dirname, './controllers')};//tells the router where the controllers are. Router middleware should check on the spec file which one to use
var spec = fs.readFileSync(path.join(__dirname, 'oai-spec.yaml'), 'utf8');
var oasDoc = jsyaml.safeLoad(spec);

oasTools.initializeMiddleware(oasDoc, function (middleware) {
  // Validate incoming requests...should this middleware also check the specification file (json/yaml valid file and matching the OASv3 schema)?
  app.use(middleware.OASValidator());

  // Route validated requests to appropriate controller
  //If I pass the controllers variable to the router middleware function, this is being executed as soon as I start the application, how can I fix that? Just by checking (in the
  //middleware itself) if the provided variable is undefined (actually Pablo told me to do it that way but I don't think it is elegant).
  app.use(middleware.OASRouter(options));

  // Start the server
  http.createServer(app).listen(serverPort, function() {
    console.log("App running at http://localhost:"+serverPort);
  });

});
