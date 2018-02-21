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
 * Checks if the code sent as a response for the previous request is inidcated in the specification file for that kind of request.
 * This function is used in the interception of the response sent by the controller to the client that made the reques.
 * @param {object} spec - Specification file.
 * @param {object} resFromController - Method requested by the client.
 */
function checkResponseCode(spec,resFromController){
  var res = true;
  //TODO
  return res;
}

/**
 * Checks whether there is a standard controller (resouce+Controlle) in the location where the controllers are located or not.
 * @param {object} locationOfControllers - Location provided by the user where the controllers can be found.
 * @param {object} controllerName - Name of the controller: resource+Controller.
 */
function existsController(locationOfControllers, controllerName){
  auxReq.loggerFunction(locationOfControllers + " --- " + controllerName);
  load = require(path.join(locationOfControllers, controllerName));
  if(load==undefined){
    return false;
  }else{
    return true;
  }
}

/**
 * Removes '/' from the requested url and generates the standard name for controller: nameOfResource + "Controller"
 * @param {object} url - Url requested by the user, without parameters
 */
function generateName(url){
  return url.substring(1,url.length).toString()+"Controller";
}

exports = module.exports = function(options) {
  auxReq.loggerFunction("Controller initialized at: " + options.controllers);
  return function OASRouter(req, res, next) {
    var spec = res.locals.spec;
    auxReq.loggerFunction("This is the spec file: ");
    auxReq.loggerFunction(spec);
    var url = res.locals.requestedUlr;
    var method = req.method.toLowerCase();

    var controllerName;
    if(spec.paths[url][method].hasOwnProperty('x-router-controller')){ //usar el nombre que se indica en x-router-controller dentro de la carpeta controladores
      controllerName = spec.paths[url][method]['x-router-controller'];
      if(spec.paths[url][method].hasOwnProperty('operationId')){
        //usar el opId (función) que indica la especificacion
        var opID = spec.paths[url][method].operationId.toString();
      }else{
        //usar la función cuyo nombre es metodo+recurso (listPets o createPets por ejemplo)
        var opID = nameMethod(spec.paths[url][method]).toString() + nameOfPath(spec.paths[url][method]).toString();
      }
    }else if(existsController(options.controllers, generateName(url))){ // (puede que no exista la propiedad pero sí un operationId) Usar como controlador: recurso+Controller
      controllerName = nameOfPath(spec.paths[url][method]).toString() + "Controller";
      if(spec.paths[url][method].hasOwnProperty(operaionId)){
        //usar el opId (función) que indica la especificacion
        var opID = spec.paths[url][method].operationId.toString();
      }else{
        //usar la función cuyo nombre es metodo+recurso (listPets o createPets por ejemplo)
        var opID = nameMethod(spec.paths[url][method]).toString() + nameOfPath(spec.paths[url][method]).toString();
      }
    }else{
      //use default controller
      controllerName = "Defualt";
      if(spec.paths[url][method].hasOwnProperty(operaionId)){
        //usar el opId (función) que indica la especificacion
        var opID = spec.paths[url][method].operationId.toString();
      }else{
        //usar la función cuyo nombre es metodo+recurso (listPets o createPets por ejemplo)
        var opID = nameMethod(spec.paths[url][method]).toString() + nameOfPath(spec.paths[url][method]).toString();
      }
    }

    var controller = require(path.join(options.controllers, controllerName));
    auxReq.loggerFunction("Controller for the requested path: ");
    auxReq.loggerFunction(controller);


    executeFunctionByName(opID, controller, req, res, next); //should receive the name of the function to use and the controller where it can be found

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
