//Analyzing the specification files examples from the oficial repo, I see that the structure path/method/opID is the same in both versions. So, shouldn't the router for version 2
//(used by Pablo for the project he deploys in his presentation) also work for specification files of version 3?

//The examples on the oficial repo don't have x-swagger-router-controller: "Default". Pablo's talkVotes has it and this way he can indicate the middleware where the controllers
//will be located. I have to do a npm module that must check if this property exists in the provided as input specification file. It is is indeed specified, then this file
//must be used and if it is not used, then the default one should be used. However, which one is the default one? As swagger doesnt use this, generate a project using swagger editor
//with their default specification file to see where they place the controllers, and this location will be the one I will consider as default.

//The middleware must return status code, the same way swagger-tools does it. However, it MUST return the status code specified in the spec file, right? Check swagger-tools!

console.log("Middleware initialized");

var exports = module.exports = {};
var express = require("express");
var app = express();
var yaml = require('js-yaml');
var fs = require('fs');
//var url = require('url');
//const window = require("window");

var controllers; /* = require('./controllers/Default.js'); */

function specContainsPath(pathsAsJson, requestedUrl, method) {
  console.log(pathsAsJson);
  console.log("--------------------------");
  console.log(method + " - " + requestedUrl);
  var res = false;
  //Check here whether the provided specification file contains the requested url in the req value. If it contains it, then it must be checked whether the requested method is
  //specified in the specification for the requested url.
  //If this requested peer has a match in the specification file then this function returns true, otherwise it must return false.
  if (pathsAsJson.hasOwnProperty(requestedUrl)) { //Check path section contains the requested url (requestedUrl)
    if (pathsAsJson[requestedUrl].hasOwnProperty(method)) { //Check the requested path (contained in the specification) allows the requested method.
      res = true;
    }
  }
  return res;
}

function executeFunctionByName(functionName, context, req, res, next) {
  var args = Array.prototype.slice.call(arguments, 3);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for (var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, [req, res, next]);
}

function validateOAISchema(spec) {
  res = true;
  //chech if the spec file in the parameter is a valid specification version 3 file using the JSON-schema for OAI
  return true;
}

exports.OAIvalidator = function(req, res, next) { //The validator in the swagger-tools module can be used for several versions of swagger. Mine will be only used for version3!
  console.log('An URL was requested...so middleware OAIvalidator was executed!');

  var requestedUrl = req.url;
  var method = req.method.toLowerCase();

  //It is being validated that the specification file is indeed a valid YAML/JSON file, however, I should aslo check that the specification file is a valid Swagger/OAI file
  //This can be done easily with libraries. Use for this json-schema library for OAI (exists!)
  var valid = true;
  try {
    var spec = yaml.safeLoad(fs.readFileSync('oai-spec.yaml', 'utf8'));
  } catch (e) {
    console.log(e);
    valid = false;
  }

  if (valid) {
    if (validateOAISchema(spec) == true) {
      if (specContainsPath(spec.paths, requestedUrl, method) == true) {
        res.locals.spec = spec;
        next(); //Everything okay, go to next middleware: router
      } else {
        res.status(400).send({
          message: "The requested path is not in the specification file"
        });
      }
    } else {
      res.status(400).send({
        message: "The speficication file is not a valid OAI version 3 file"
      });
    }
  } else {
    res.status(400).send({
      message: "Specification file is not a valid YAML/JSON file"
    });
  }
}

exports.OAIrouter = function(options) {
  controllers = require(options.controllers);
  console.log("Controller initialized at: " + options.controllers);
  return function swaggerRouter(req, res, next) { /* this way the issue of app.use need a middleware function is fixed and in fact it's how swagger-tools router does it*/
    /* Validator checks that the specs file contains the requested peer path-method, therefore this middleware just has to look for the operationId for that peer then go to the
        right controller and execute the operation. */
    var spec = res.locals.spec;
    var url = req.url.toString();
    var method = req.method.toLowerCase();
    var opID = spec.paths[url][method].operationId.toString();
    executeFunctionByName(opID, controllers, req, res, next);
  }
}
