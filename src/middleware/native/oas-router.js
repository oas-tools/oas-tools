import { OASBase } from "./oas-base";
import { commons } from "../../utils";

export class OASRouter extends OASBase {

    constructor(oasFile, middleware) {
      super(oasFile, middleware);
    }

    static initialize(oasFile, config) {
      // TODO Routing validations and error handling
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
      if (config.endpoints) { // Load when annotations enabled
        Object.entries(config.endpoints).forEach(([path, arr]) => {
          let tmp = {};
          let expressPath = path.replace(/{/g, ':').replace(/}/g, '');
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
          });
          controllers[expressPath] = tmp;
        });
      }
      return controllers;
    }
}