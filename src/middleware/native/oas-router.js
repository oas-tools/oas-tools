import { OASBase } from "./oas-base";

export class OASRouter extends OASBase {

    constructor(oasFile, middleware) {
      super(oasFile, middleware);
    }

    static initialize(oasFile, config) {
      return new OASRouter(oasFile, (req, res, next) => {console.log(res.locals); next();});
    }
}