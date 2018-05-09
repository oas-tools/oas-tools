'use strict';

var fs = require('fs'),
  path = require('path'),
  http = require('http');

var express = require("express");
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json());
var oasTools = require('../../src/index.js');
var jsyaml = require('js-yaml');
var serverPort = 8383;

var spec = fs.readFileSync(path.join(__dirname, 'oai-spec.yaml'), 'utf8'); //this one works
var oasDoc = jsyaml.safeLoad(spec);

var options_string = path.join(__dirname, './configurations/customConfig.yaml');

var options_object = {
  controllers: path.join(__dirname, './controllers'),
  loglevel: 13,
  strict: true,
  router: true,
  validator: true
};

oasTools.configure(options_object);

oasTools.initialize(oasDoc, app, function() { // oas-tools version
  http.createServer(app).listen(serverPort, function() {
    console.log("App running at http://localhost:" + serverPort);
    console.log("________________________________________________________________");
  });
});

/*
var options = {controllers : path.join(__dirname, './controllers')}; //options_swagger

oasTools.initializeMiddleware(oasDoc, function (middleware) { //swagger-tools version
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  //app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.OASValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.OASRouter(options));

  // Serve the Swagger documents and Swagger UI
  //app.use(middleware.swaggerUi());

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });
});
*/

app.get('/info', function(req, res) {
  res.send({
    infoDE: "Diese ist eine sehr einfach API die benutzt unsere oas-tools module!",
    infoEN: "This is a very simple API that uses the oas-tools Module!"
  });
});

module.exports = app;
