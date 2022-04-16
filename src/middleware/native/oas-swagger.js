import swaggerUI from 'swagger-ui-express';
import _ from 'lodash';

export class OASSwagger {
    #middleware;
    
    constructor(middleware) {
      this.#middleware = middleware;
    }

    static initialize(config, oasFile) {
      return new OASSwagger((req, _res, next) => {
        req.swaggerDoc = _.cloneDeep(oasFile);
        next();
      });  
    }

    register(path, method, app) {
      app[method && method !== '*' ? method : 'use'](path, this.#middleware, swaggerUI.serve, swaggerUI.setup());
    }

    getMiddleware() {
        return this.#middleware;
    }
}