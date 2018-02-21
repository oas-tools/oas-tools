var auxReq = require('../index.js');
auxReq.loggerFunction("Router middleware initialized");

var exports;
var path = require('path');
var controllers;

/**
 * Executes a function whose name is stored in a string value
 * @param {string} functionName - Name of the function to be executed.
 * @param {string} context - Location of the function to be executed.
 * @param {string} req - Request object (necessary for the execution of the controller).
 * @param {string} res - Response object (necessary for the execution of the controller).
 * @param {string} next - Express middleware next function (necessary for the execution of the controller).
 */
function executeFunctionByName(functionName, context, req, res, next) {
  var args = Array.prototype.slice.call(arguments, 3);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for (var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, [req, res, next]);
}

/**
 * Checks if the code sent as a response for the previous request is inidcated in the specification file for that kind of request
 * @param {object} spec - Specification file.
 * @param {object} resFromController - Method requested by the client.
 */
function checkResponseCode(spec,resFromController){
  var res = true;
  //TODO
  return res;
}

exports = module.exports = function(options) {
  auxReq.loggerFunction("Controller initialized at: " + options.controllers);
  return function OASRouter(req, res, next) {
    var spec = res.locals.spec;
    var url = res.locals.requestedUlr;
    var method = req.method.toLowerCase();
    var controllerName = spec.paths[url][method]['x-router-controller'];
    if (controllerName == undefined) {
      controllerName = 'Default'; //No controller is specified in the spec file so use the default one
    }
    var controller = require(path.join(options.controllers, controllerName));
    auxReq.loggerFunction(controller);
    var opID = spec.paths[url][method].operationId.toString();
    executeFunctionByName(opID, controller, req, res, next);

    var oldSend = res.send;

    res.send = function(data) {
      // arguments[0] (or `data`) contains the response body
      arguments[0] = "modified : " + arguments[0];
      oldSend.apply(res, arguments);

      if (checkResponseCode(spec,resFromController)==false){
        auxReq.loggerFunction("WARNING: wrong response code");
        auxReq.loggerFunction(wrongResponseCodes);
      }

    }
    next();

  }
}
