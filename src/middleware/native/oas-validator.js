import { OASBase } from "./oas-base";
import { logger } from "../../utils";

export class OASRequestValidator extends OASBase {

  constructor(oasFile, middleware) {
    super(oasFile, middleware);
  }

  static initialize(oasFile, config) {
    return new OASRequestValidator(oasFile, (req, res, next) => {  
      logger.info(`Requested ${req.method} ${req.originalUrl}`);
      next();
    });
  }
}