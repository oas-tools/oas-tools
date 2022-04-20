export class OASBase {
    #middleware;
    #oasFile;

    constructor(oasFile, middleware) {
      this.#middleware = middleware;
      this.#oasFile = oasFile;
    }

    register(app) {
      Object.entries(this.#oasFile.paths).forEach(([path, methodObj]) => {
        Object.keys(methodObj).forEach(method => {
            app[method](path, this.#middleware);
        });
      });
    }

    getMiddleware() {
        return this.#middleware;
    }
}