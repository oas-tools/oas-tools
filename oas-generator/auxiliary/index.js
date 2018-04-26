'use strict';

var fs = require('fs'),
  path = require('path'),
  http = require('http');

var express = require("express");
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json());
var oasTools = require('../../src/index.js'); //This must be updated when on production! oas-tools will be inside node_modules
var jsyaml = require('js-yaml');
var serverPort = 8080;

var spec = fs.readFileSync(path.join(__dirname, '/api/oas-doc.yaml'), 'utf8'); //this one works
var oasDoc = jsyaml.safeLoad(spec);

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

app.get('/info', function(req, res) {
  res.send({
    info: "This API was generated using oas-generator!"
  });
});

module.exports = app;
