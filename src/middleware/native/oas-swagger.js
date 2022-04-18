import swaggerUI from 'swagger-ui-express';
import _ from "lodash";

export class OASSwagger {
    #middleware;
    #options;
    
    constructor(options, middleware) {
      this.#middleware = middleware;
      this.#options = options;
    }

    static initialize(config, oasFile, endpointCfg) {
      let swaggerFile = OASSwagger.#filterPaths(oasFile, endpointCfg);
      return new OASSwagger(config.ui, (req, _res, next) => {
        req.swaggerDoc = swaggerFile;
        next();
      });  
    }

    register(path, method, app) {
      app[method && method !== '*' ? method : 'use'](path, this.#middleware, swaggerUI.serve, swaggerUI.setup(null, this.#options));
    }

    getMiddleware() {
        return this.#middleware;
    }

    /* Private methods */
    static #filterPaths(oasFile, endpointCfg) {
      let swaggerFile = _.cloneDeep(oasFile);

      swaggerFile.paths = Object.fromEntries(Object.entries(swaggerFile.paths).map(([path, methods]) => {
        return [path, Object.fromEntries(Object.entries(methods).filter(([method, methodObj]) => {
          if (!endpointCfg) return methodObj['x-swagger-ui'] !== false;
          return endpointCfg[path]?.find(e => e.method?.toLowerCase() === method)?.swaggerUI !== 'false';
        }))];
      }));

      return swaggerFile;
    }
}