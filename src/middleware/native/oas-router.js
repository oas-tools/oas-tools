import { OASBase, errors, logger } from "@oas-tools/commons";
import { commons } from "../../utils/index.js";
import { pathToFileURL } from "url";

export class OASRouter extends OASBase {

  constructor(oasFile, middleware) {
    super(oasFile, middleware);
  }

  static async initialize(oasFile, config) {
    const controllers = await OASRouter.#loadControllers(oasFile, config);
    return new OASRouter(oasFile, async (req, res, _next) => {
      const requestPath = req.route.path;
      const method = req.method;
      try {
        await controllers[requestPath][method](req, res, _next);
      } catch (err) {
        _next(err)
      }
    });
  }

  /* Private methods */
  static async #loadControllers(oasFile, config) {
    const controllers = {};

    try {
      if (config.endpoints) { // Load when annotations enabled

        /* Previous validations */
        const oasEndpoints = Object.entries(oasFile.paths).flatMap(([path, pathObj]) => Object.keys(pathObj).map((method) => `${method.toUpperCase()} ${path}`));
        const annEndpoints = Object.entries(config.endpoints).flatMap(([path, pathArr]) => pathArr.map((obj) => `${obj.method} ${commons.expressPath(path)}`));
        const oasDiff = commons.arrayDiff(oasEndpoints, annEndpoints);
        const annDiff = commons.arrayDiff(annEndpoints, oasEndpoints);
        const missingMethod = annEndpoints.filter((x) => (/undefined [\S]+/).test(x)).map((x) => x.split(' ')[1]);

        if (missingMethod.length > 0) throw new Error(`No HTTP method specified for:\n > ${missingMethod.join('\n > ')}`);
        if (oasDiff.length > 0) logger.warn(`Missing Routing annotations(path, method) for:\n > ${oasDiff.join('\n > ')}`);
        if (annDiff.length > 0) logger.warn(`Missing OAS declaration for:\n > ${annDiff.join('\n > ')}`);

        /* Import functions */
        await Promise.all(Object.entries(config.endpoints).map(async ([path, arr]) => {
          const tmp = {};
          const expressPath = commons.expressPath(path);
          await Promise.all(arr.map((e) => import(pathToFileURL(e.exportPath)).then((imp) => tmp[e.method] = imp[e.exportName])));
          controllers[expressPath] = tmp;
        }));
      } else { // Load when annotations disabled
        const allowedMethods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
        await Promise.all(Object.entries(oasFile.paths).flatMap(([expressPath, obj]) => {
          const controllerName = obj['x-router-controller'] ?? commons.generateName(expressPath, "controller");

          return Object.entries(obj)
            .filter(([method, _methodObj]) => allowedMethods.includes(method.toLowerCase()))
            .map(async ([method, methodObj]) => {
              const tmp = {};
              const opId = methodObj.operationId ?? commons.generateName(expressPath, "function");
              const opControllerName = methodObj['x-router-controller'] ?? controllerName;
              const path = commons.filePath(config.controllers, opControllerName);

              if (!path) throw new errors.RoutingError(`Controller ${opControllerName} not found`);

              tmp[expressPath] = {
                ...tmp[expressPath],
                [method.toUpperCase()]: (await import(pathToFileURL(path)))[opId]
              };

              if (!tmp[expressPath][method.toUpperCase()])
                throw new Error(`Controller ${path} does not have method ${opId}`);

              return tmp
            });
        })).then((result) => {
          result.forEach((obj) => {
            const [path, methodObj] = Object.entries(obj)[0];
            controllers[path] = { ...controllers[path], ...methodObj };
          });
        });
      }
      return controllers;
    } catch (err) { // Exception handling
      throw new errors.RoutingError(err.message);
    }
  }
}
