var auxReq = require('../index.js');
auxReq.loggerFunction("Validator middleware initialized");

var exports;
var yaml = require('js-yaml');
//var indexFile = require('../index'); //This was used to have here the specification file indicated in the index.js of the application, passed to the init middleware function (index.js of oas-tools module)
var Type = require('type-of-is'); //Check docs: https://www.npmjs.com/package/type-of-is
var fs = require('fs');
var path = require('path');
var http = require('http');

/**
 * Check whether the provided specification file contains the requested url in the req value. If it contains it, then it must be checked whether the requested method is
 * specified in the specification for that requested url.
 * If this requested peer has a match in the specification file then this function returns true, otherwise it must return false.
 * @param {object} paths - Portion of code in yaml containing the path section from the spec file.
 * @param {string} requestedUrl - Requested url by the client. If the request had parameters in the query those won't be part of this variable.
 * @param {string} method - Method requested by the client.
 */
function specContainsPath(paths, requestedUrl, method) {
  auxReq.loggerFunction("Requested method-url pair:");
  auxReq.loggerFunction(method + " - " + requestedUrl);
  var res = false;
  if (paths.hasOwnProperty(requestedUrl)) {
    if (paths[requestedUrl].hasOwnProperty(method)) {
      res = true;
    }
  }
  return res;
}

/**
 * Checks if the data provided in the request is valid acording to what is specified in the oas specification file
 * @param {object} paths - Portion of code in yaml containing the path section from the spec file.
 * @param {string} requestedUrl - Requested url by the client. If the request had parameters in the query those won't be part of this variable.
 * @param {string} method - Method requested by the client.
 * @param {string} req - The whole req object from the client request.
 */
function checkRequestData(paths, requestedUrl, method, req){
  var res = [];
  var missingParameters = [];
  var wrongParameters = [];
  if(paths[requestedUrl][method].hasOwnProperty('parameters')){
    var params = paths[requestedUrl][method]['parameters'];
    for(var i = 0; i<params.length;i++){
      if(params[i].required.toString() == 'true'){
        var name = params[i].name;
        var location = params[i].in;
        if(req[location][name] == undefined){
          missingParameters.push([name,location]);
        }else if(params[i].schema.type.toString() != Type.string(req[location][name])){ //in the case of array, check also type of its items!
          auxReq.loggerFunction("compared types: "+ params[i].schema.type.toString() + " --- " + Type.string(req[location][name]))
          wrongParameters.push(name);
        }
      }
    }
  }
  res.push(missingParameters);
  res.push(wrongParameters);
  return res;
}

exports = module.exports = function(specDoc) {
  return function OASValidator(req, res, next) {
    var spec = specDoc;
    var requestedUrl = req.url.split("?")[0]; //allows requests with parameters in the query
    var method = req.method.toLowerCase();
    res.locals.requestedUlr = requestedUrl;

    if (specContainsPath(spec.paths, requestedUrl, method) == true) {
      var missingOrWrongParameters = checkRequestData(spec.paths, requestedUrl, method, req);
      if(missingOrWrongParameters[0].length > 0){
        auxReq.loggerFunction("WARNING: the following parameters were required but weren't sent in the request:");
        auxReq.loggerFunction(missingOrWrongParameters[0]);
      }
      if(missingOrWrongParameters[1].length > 0){
        auxReq.loggerFunction("WARNING: the following parameters were not of the right type:");
        auxReq.loggerFunction(missingOrWrongParameters[1]);
      }
      res.locals.spec = spec;
      next();
    } else {
      res.status(400).send({
        message: "The requested path is not in the specification file"
      });
    }
  }
}
