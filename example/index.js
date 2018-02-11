'use strict';

var fs = require('fs'), path = require('path'), http = require('http');

var express = require("express");
var app = express();
var middlewareOAI = require('./middlewareOAI.js');
var jsyaml = require('js-yaml');
var serverPort = 8383;

//configuration

var options = { controllers : path.join(__dirname, './controllers/Default') };//tells the middleware where the controllers are

/* This must be corrected, as loading the spec file and initializing the path to the controllers is being done in the middleware which is wrong. It must be done here BECAUSE the
code generator writes this file acording to what it reads in the spec file. So I must specify this in the specification file!
var spec = fs.readFileSync(path.join(__dirname, 'oai-spec.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec); */

// Validate Swagger requests
app.use(middlewareOAI.OAIvalidator);

// Route validated requests to appropriate controller.
//If I pass the controllers variable to the router middleware function, this is being executed as soon as I start the application, how can I fix that? Just by checking (in the
//middleware itself) if the provided variable is undefined (actually Pablo told me to do it that way but I don't think it is elegant).
app.use(middlewareOAI.OAIrouter(options));

// Start the server
http.createServer(app).listen(serverPort, function() {
  console.log("App running at http://localhost:"+serverPort);
});
