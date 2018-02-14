//Analyzing the specification files examples from the oficial repo, I see that the structure path/method/opID is the same in both versions. So, shouldn't the router for version 2
//(used by Pablo for the project he deploys in his presentation) also work for specification files of version 3?

//The examples on the oficial repo don't have x-swagger-router-controller: "Default". Pablo's talkVotes has it and this way he can indicate the middleware where the controllers
//will be located. I have to do a npm module that must check if this property exists in the provided as input specification file. It is is indeed specified, then this file
//must be used and if it is not used, then the default one should be used. However, which one is the default one? As swagger doesnt use this, generate a project using swagger editor
//with their default specification file to see where they place the controllers, and this location will be the one I will consider as default.

//The middleware must return status code, the same way swagger-tools does it. However, it MUST return the status code specified in the spec file, right? Check swagger-tools!

console.log("Router middleware initialized");

var exports; // = module.exports = {};
var path = require('path');
var controllers;

function executeFunctionByName(functionName, context, req, res, next) {
  var args = Array.prototype.slice.call(arguments, 3);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for (var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, [req, res, next]);
}

exports = module.exports = function (options) {
//exports.OASrouter = function(options) {
  controllersLocation = options.controllers;
  console.log("Controller initialized at: " + options.controllers);
  return function OASRouter(req, res, next) { /* this way the issue of app.use need a middleware function is fixed and in fact it's how swagger-tools router does it*/
    /* Validator checks that the specs file contains the requested peer path-method, therefore this middleware just has to look for the operationId for that peer then go to the
        right controller and execute the operation. */
    var spec = res.locals.spec;
    var url = req.url.toString();
    var method = req.method.toLowerCase();
    var controllerName = spec.paths[url][method]['x-router-controller'];
    if(controllerName==undefined){
      controllerName = 'Default'; //No controller is specified in the spec file so use the default one
    }
    var controller = require(path.join(controllersLocation, controllerName));
    console.log(controller);
    var opID = spec.paths[url][method].operationId.toString();
    executeFunctionByName(opID, controller, req, res, next);
  }
}
