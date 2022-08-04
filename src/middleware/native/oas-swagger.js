import { OASBase } from '@oas-tools/commons';
import swaggerUI from 'swagger-ui-express';
import _ from "lodash";

export class OASSwagger extends OASBase {
    #config;

    constructor(config, oasFile, middleware) {
      super(oasFile, middleware);
      this.#config = config;
    }

    static initialize(oasFile, config) {
      const swaggerFile = OASSwagger.#filterPaths(oasFile, config.endpoints);
      return new OASSwagger(config, oasFile, (req, _res, next) => {
        req.swaggerDoc = swaggerFile;
        next();
      });  
    }

    /* Overridden */
    register(app) {
      app.use(this.#config.path, super.getMiddleware(), swaggerUI.serve, swaggerUI.setup(null, this.#config.ui));
    }

    /* Private methods */
    static #filterPaths(oasFile, endpointCfg) {
      const swaggerFile = _.cloneDeep(oasFile);

      swaggerFile.paths = Object.fromEntries(Object.entries(swaggerFile.paths).map(([path, methods]) => {
        return [
          path, Object.fromEntries(Object.entries(methods).filter(([method, methodObj]) => {
            if (!endpointCfg) return methodObj['x-swagger-ui'] !== false;
            return endpointCfg[path]?.find((e) => e.method?.toLowerCase() === method)?.swaggerUI !== 'false';
          }))
        ];
      }));

      return swaggerFile;
    }
}
