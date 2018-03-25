'use strict';

var fs = require('fs'), path = require('path'), http = require('http');

var express = require("express");
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json());
var oasTools = require('../../src/index.js');
var jsyaml = require('js-yaml');
var serverPort = 8383;

var spec = fs.readFileSync(path.join(__dirname, 'oai-spec.yaml'), 'utf8'); //this one works
var oasDoc = jsyaml.safeLoad(spec);

var options_string =  path.join(__dirname, './configurations/customConfig.yaml');

var options_object = {controllers : path.join(__dirname, './controllers'),
              loglevel: 13,
              strict: false,
              router: true,
              validator: true
            };

//oasTools.configure(options_object);

oasTools.initializeMiddleware(oasDoc, app, function () {
  http.createServer(app).listen(serverPort, function() {
    console.log("App running at http://localhost:"+serverPort);
    console.log("________________________________________________________________");
  });
});

module.exports = app;
