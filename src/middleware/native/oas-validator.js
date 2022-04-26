import { OASBase } from "./oas-base";
import { logger } from "../../utils";
import addFormats from "ajv-formats";
import Ajv from "ajv";

export class OASRequestValidator extends OASBase {

  constructor(oasFile, middleware) {
    super(oasFile, middleware);
  }

  static initialize(oasFile, config) {
    /* Instanciate validator */
    const ajv = new Ajv({strict: false, logger: logger});
    addFormats(ajv);

    /* Instanciate middleware */
    return new OASRequestValidator(oasFile, (req, res, next) => {  
      logger.info(`Requested ${req.method} ${req.originalUrl}`);
      let oasRequest = oasFile.paths[req.route.path][req.method.toLowerCase()];

      /* Check body */
      if (res.locals.oas.body && JSON.stringify(res.locals.oas.body) !== "{}") {
        const contentType = Object.keys(oasRequest.requestBody.content)[0];
        const schema = oasRequest.requestBody.content[contentType].schema;
        let body = res.locals.oas.body;
        
        /* On multipart requests insert files in body for validation */
        if (contentType.toLocaleLowerCase() === 'multipart/form-data' && res.locals.oas.files) {
          res.locals.oas.files.forEach(file => {
            if(file.fieldname && file.originalname) {
              if(req.file?.fieldname === file.fieldname) body[file.fieldname] = file.originalname // single file uploaded
              else body[file.fieldname] = body[file.fieldname]? [...body[file.fieldname], file.originalname] : [file.originalname] // multiple files uploaded
            } else {
              logger.warn('Ignored files in validation: Unable to find properties {fieldname, originalname} in file', file);
            }
          });
        }

        const validate = ajv.compile(schema);
        const valid = validate(body);

        if (!valid) {
          logger.warn(`Request body does not match the schema specified in the OAS Document:\n${validate.errors.map(e => `- Validation failed at ${e.schemaPath} > ${e.message}`).join("\n")}`);
        }

      } else if (oasRequest.requestBody?.required) {
        logger.warn("Missing object in the request body. Request body is required.");
      }

      /* Check parameters */
      if (res.locals.oas.params && JSON.stringify(res.locals.oas.params) !== "{}") {
        oasRequest.parameters.forEach(param => {
          const value = res.locals.oas.params[param.name];
          if (typeof value !== "undefined") {
            let schema;
            if (param.schema) schema = param.schema;
            else {
              const contentType = Object.keys(param.content)[0];
              schema = param.content[contentType].schema;
            }

            const validate = ajv.compile(schema);
            const valid = validate(value);

            if (!valid) {
              logger.warn(`Parameter ${param.name} does not match the schema specified in the OAS Document:\n${validate.errors.map(e => `- Validation failed at ${e.schemaPath} > ${e.message}`).join("\n")}`);
            }

          } else if (param.required) {
            logger.warn(`Missing parameter ${param.name} in the request ${param.in}. Parameter is required.`);
          }
        });
      }
      next();
    });
  }
}