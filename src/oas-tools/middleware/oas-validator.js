//Analyzing the specification files examples from the oficial repo, I see that the structure path/method/opID is the same in both versions. So, shouldn't the router for version 2
//(used by Pablo for the project he deploys in his presentation) also work for specification files of version 3?

//The examples on the oficial repo don't have x-swagger-router-controller: "Default". Pablo's talkVotes has it and this way he can indicate the middleware where the controllers
//will be located. I have to do a npm module that must check if this property exists in the provided as input specification file. It is is indeed specified, then this file
//must be used and if it is not used, then the default one should be used. However, which one is the default one? As swagger doesnt use this, generate a project using swagger editor
//with their default specification file to see where they place the controllers, and this location will be the one I will consider as default.

//The middleware must return status code, the same way swagger-tools does it. However, it MUST return the status code specified in the spec file, right? Check swagger-tools!

console.log("Validator middleware initialized");

var exports; // = module.exports = {};
var yaml = require('js-yaml');
var fs = require('fs');

function specContainsPath(pathsAsJson, requestedUrl, method) {
  console.log(pathsAsJson);
  console.log("--------------------------");
  console.log(method + " - " + requestedUrl);
  var res = false;
  //Check here whether the provided specification file contains the requested url in the req value. If it contains it, then it must be checked whether the requested method is
  //specified in the specification for the requested url.
  //If this requested peer has a match in the specification file then this function returns true, otherwise it must return false.
  if (pathsAsJson.hasOwnProperty(requestedUrl)) { //Check 'path' section contains the requested url (requestedUrl)
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

/*
OpenAPI is a specification for describing RESTful APIs. OpenAPI 3.0 allows us to describe the structures of request and response payloads in a detailed manner.
This would, theoretically, mean that we should be able to automatically validate request and response payloads. However, as of writing there aren't many validators around.

The good news is that there are many validators for JSON Schema for different languages. The bad news is that OpenAPI 3.0 is not entirely compatible with JSON Schema.
The Schema Object of OpenAPI 3.0 is an extended subset of JSON Schema Specification Wright Draft 00 with some differences.

The purpose of the module openapi-schema-to-json-schema is to fill the grap by doing the conversion between these two formats. Procedure:
1.- Convert OASv3 to JSON Schema Specification Wright Draft 00 (JSON Schema Draft 4)
2.- Validate the resulting JSON Schema 4

*/

function validateOAISchema(spec) {
  //Load OAIv3 schema:
  var fs = require('fs'), path = require('path'), http = require('http');
  //var schemaV3 = fs.readFileSync(path.join(__dirname, '../schema/openapi-3.0.json'), 'utf8');

  res = true;
  //chech if the spec file in the parameter is a valid specification version 3 file using the JSON-schema for OAI
  return res;
}

//I must also check here parameters, so for example in the case of the post, a parameter must be sent in the body of the request to add a pet. Check this and show a warning
//if this object is not being sent (which wont be sent as the testing project is very simple and just adds static pets but that is enough by now)!
//In fact 4b is only for data and not the structure of the request itself (path-method)! check video from 33:11

exports = module.exports = function () { //The validator in the swagger-tools module can be used for several versions of swagger. Mine will be only used for version3!
//exports.OASvalidator = function(req, res, next) {
return function OASValidator(req, res, next) {
  console.log('An URL was requested...so middleware OAIvalidator was executed!');

  var requestedUrl = req.url;
  var method = req.method.toLowerCase();

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
}
