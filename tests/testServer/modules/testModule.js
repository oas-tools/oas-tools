import { OASBase } from "@oas-tools/commons";

export class OASTest extends OASBase {

    constructor(oasFile, middleware) {
        super(oasFile, middleware);
    }

    static initialize(oasFile, config) {
        return new OASTest(oasFile, (_req, res, next) => {
            res.locals.oas = { ...res.locals.oas, test: config.test }
            next()
        });
    }
}