'use strict';

var fs = require('fs'),
  path = require('path'),
  http = require('http');

var express = require("express");
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json());
var oasTools = require('../../index.js');
var jsyaml = require('js-yaml');
var serverPort = 8080;

var spec = fs.readFileSync(path.join(__dirname, 'api/oai-spec.yaml'), 'utf8'); //this one works
var oasDoc = jsyaml.safeLoad(spec);

var options_string = path.join(__dirname, './configurations/customConfig.yaml');

var options_object = {
  controllers: path.join(__dirname, './controllers'),
  loglevel: 'debug',
  strict: true,
  router: true,
  validator: true,
  ignoreUnknownFormats: true
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
    infoEN: "This is a very simple API that uses the oas-tools Module!",
    infoDE: "Diese ist eine sehr einfach API die benutzt unsere oas-tools module!"
  });
});

module.exports = app; //export for chai tests
