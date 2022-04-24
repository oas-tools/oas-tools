import { OASBase } from "./oas-base";
import { commons, errors, logger } from "../../utils";

export class OASRouter extends OASBase {

  constructor(oasFile, middleware) {
    super(oasFile, middleware);
  }

  static initialize(oasFile, config) {
    const controllers = OASRouter.#loadControllers(oasFile, config);
    return new OASRouter(oasFile, (req, res, next) => {  
      let requestPath = req.route.path;
      let method = req.method;
      controllers[requestPath][method](req, res);
      next();
    });
  }

  /* Private methods */
  static #loadControllers(oasFile, config) {
    let controllers = {};

    try {
      if (config.endpoints) { // Load when annotations enabled

        /* Previous validations */
        let oasEndpoints = Object.entries(oasFile.paths).flatMap(([path, pathObj]) => Object.keys(pathObj).map(method => `${method.toUpperCase()} ${path}`));
        let annEndpoints = Object.entries(config.endpoints).flatMap(([path, pathArr]) => pathArr.map(obj => `${obj.method} ${commons.expressPath(path)}`));
        let oasDiff = commons.arrayDiff(oasEndpoints, annEndpoints);
        let annDiff = commons.arrayDiff(annEndpoints, oasEndpoints);
        let missingMethod = annEndpoints.filter(x => /undefined [\S]+/.test(x)).map(x => x.split(' ')[1]);

        if (missingMethod.length > 0) throw new Error(`No HTTP method specified for:\n > ${missingMethod.join('\n > ')}`);
        if (oasDiff.length > 0) logger.warn(`Missing Routing annotations(path, method) for:\n > ${oasDiff.join('\n > ')}`);
        if (annDiff.length > 0) logger.warn(`Missing OAS declaration for:\n > ${annDiff.join('\n > ')}`);
        
        /* Import functions */
        Object.entries(config.endpoints).forEach(([path, arr]) => {
          let tmp = {};
          let expressPath = commons.expressPath(path);
          arr.forEach(e => tmp[e.method] = require(e.exportPath)[e.exportName]);
          controllers[expressPath] = tmp;
        })
      } else { // Load when annotations disabled
        Object.entries(oasFile.paths).forEach(([expressPath, obj]) => {
          let tmp = {};
          let opId = commons.generateName(expressPath, "function");
          let controllerName = obj['x-router-controller'] ?? commons.generateName(expressPath, "controller");
          Object.entries(obj).forEach(([method, methodObj]) => {
            opId = methodObj['operationId'] ?? opId;
            controllerName = methodObj['x-router-controller'] ?? controllerName;
            tmp[method.toUpperCase()] = require(`${config.controllers}/${controllerName}`)[opId];
            if (!tmp[method.toUpperCase()]) 
              throw new Error(`Controller ${controllerName} does not have method ${opId}`);
          });
          controllers[expressPath] = tmp;
        });
      }
      return controllers;
    } catch (err) { // Exception handling
      switch (true) {
        case /Cannot find module/.test(err.message):
          let controllerName = [...err.message.matchAll(/Cannot find module \'([\S]*)\'/g)].flat()[1].split('/').pop();
          throw new errors.RoutingError(`Failed while importing controller. ${controllerName} does not exist.`); break;
        default:
          throw new errors.RoutingError(err.message);
      }
    }
  }
}