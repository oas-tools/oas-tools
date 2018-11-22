'use strict';

var fs = require('fs'),
  http = require('http'),
  path = require('path');

var express = require("express");
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json({
  strict: false
}));
var oasTools = require('../../src/index.js');
var jsyaml = require('js-yaml');
var serverPort = 8080;
var logger = require('./logger');

var spec = fs.readFileSync(path.join(__dirname, 'api/oai-spec.yaml'), 'utf8'); //this one works
var oasDoc = jsyaml.safeLoad(spec);

var securityThird = require(path.join(__dirname, 'security.json'));
var grantsThird = require(path.join(__dirname, 'grants.json'));

function verifyToken(req, secDef, token, next) {
  if (token) {
    next();
  } else {
    next(req.res.sendStatus(403));
  }
}

var options_object = {
  controllers: path.join(__dirname, './controllers'),
  //loglevel: 'debug',
  //loglevel: 'none',
  customLogger: logger,
  strict: true,
  router: true,
  validator: true,
  oasSecurity: true,
  securityFile: {
    SecondBearer: './tests/testServer/security.json',
    ThirdBearer: securityThird,
    FourthBearer: verifyToken
  },
  oasAuth: true,
  grantsFile: {
    SecondBearer: './tests/testServer/grants.json',
    ThirdBearer: grantsThird
  },
  ignoreUnknownFormats: true
};


function init(done) {
  oasTools.configure(options_object);

  oasTools.initialize(oasDoc, app, () => { // oas-tools version
    http.createServer(app).listen(serverPort, () => {
      // console.log("App running at http://localhost:" + serverPort);
      done();
    });
  });
  
  app.get('/info', (req, res) => {
    res.send({
      infoEN: "This is a very simple API that uses the oas-tools Module!",
      infoDE: "Diese ist eine sehr einfach API die benutzt unsere oas-tools module!"
    });
  });
}
app.init = init;
app.getServer = function getServer() { 
  return app;
}
app.close = function close() { 
  process.exit(0);
}

module.exports = app; //export for chai tests
