import { OASBase, errors, logger, validator } from "@oas-tools/commons";
import { commons, schema as schemaUtils } from "../../utils/index.js";
import MIMEtype from "whatwg-mimetype";

const { RequestValidationError, ResponseValidationError } = errors;

export class OASRequestValidator extends OASBase {
  constructor(oasFile, middleware) {
    super(oasFile, middleware);
  }

  static initialize(oasFile, config) {

    /* Instanciate middleware */
    return new OASRequestValidator(oasFile, (req, res, next) => {  
      logger.info(`Requested ${req.method} ${req.originalUrl}`);
      const oasRequest = oasFile.paths[req.route.path][req.method.toLowerCase()];

      /* Check body */
      if (res.locals.oas.body && JSON.stringify(res.locals.oas.body) !== "{}") {
        if (oasRequest.requestBody) {
          const contentType = Object.keys(oasRequest.requestBody.content)[0];
          const schema = schemaUtils.parseSchema(oasRequest.requestBody.content[contentType].schema, "request");
          const body = res.locals.oas.body;

          /* On multipart requests insert files in body for validation */
          if (contentType.toLocaleLowerCase() === 'multipart/form-data' && res.locals.oas.files) {
            res.locals.oas.files.forEach((file) => {
              if(file.fieldname && file.originalname) {
                if(req.file?.fieldname === file.fieldname) body[file.fieldname] = file.originalname // single file uploaded
                else body[file.fieldname] = body[file.fieldname]? [...body[file.fieldname], file.originalname] : [file.originalname] // multiple files uploaded
              } else {
                logger.warn('Ignored files in validation: Unable to find properties {fieldname, originalname} in file', file);
              }
            });
          }
  
          const {validate, valid} = validator.validate(body, schema, oasFile.openapi);
  
          if (!valid) {
            commons.handle(RequestValidationError, `Request body does not match the schema specified in the OAS Document:\n${validate.errors.map((e) => `- Validation failed at ${e.schemaPath} > ${e.message}`).join("\n")}`, config.strict);
          }
        } else {
          commons.handle(RequestValidationError, "Missing request body declaration in OAS Document", config.strict);
        }
      } else if (oasRequest.requestBody?.required) {
        commons.handle(RequestValidationError, "Missing object in the request body. Request body is required.", config.strict);
      }

      /* Check parameters */
      const commonParams = oasFile.paths[req.route.path].parameters;
      const methodParams = oasRequest.parameters ?? commonParams;
      const parameters = commonParams ? [...new Set([...methodParams, ...commonParams])] : methodParams;

      // Check for extraneous query params
      const missingParams = Object.keys(req.query ?? {}).filter((qp) => !parameters?.filter((p) => p.in === "query").map((p) => p.name).includes(qp));
      if (missingParams.length > 0) {
        commons.handle(RequestValidationError, "Extraneous parameter found in request query:\n" + missingParams.map((p) => `  - Missing declaration for "${p}"`).join("\n"), config.strict);
      }

      // Validate against schema
      if (res.locals.oas.params && Object.keys(res.locals.oas.params).length > 0) {
        parameters.forEach((param) => {
          const value = res.locals.oas.params[param.name];
          if (typeof value !== "undefined") {
            let schema;
            if (param.schema) schema = param.schema;
            else {
              const contentType = Object.keys(param.content)[0];
              schema = param.content[contentType].schema;
            }

            const {validate, valid} = validator.validate(value, schema, oasFile.openapi);

            if (!valid) {
              commons.handle(RequestValidationError, `Parameter ${param.name} does not match the schema specified in the OAS Document:\n${validate.errors.map((e) => `- Validation failed at ${e.schemaPath} > ${e.message}`).join("\n")}`, config.strict);
            }

          } else if (param.required) {
            commons.handle(RequestValidationError, `Missing parameter ${param.name} in the request ${param.in}. Parameter is required.`, config.strict);
          }
        });
      }
      next();
    });
  }
}

export class OASResponseValidator extends OASBase {
  constructor(oasFile, middleware) {
    super(oasFile, middleware);
  }

  static initialize(oasFile, config) {

    /* Instanciate middleware */
    return new OASResponseValidator(oasFile, (req, res, next) => {
      const oasRequest = oasFile.paths[req.route.path][req.method.toLowerCase()];

      /* Intercepts response */
      const oldSend = res.send;
      res.send = function send(data) {
        const code = res.statusCode;
        const contentType = new MIMEtype(res.get("content-type") ?? "application/json;charset=utf-8");
        const expectedResponse = oasRequest.responses[code] ?? oasRequest.responses[`${Math.floor(code / 100)}XX`] ?? oasRequest.responses.default;

        /* Check content type */
        if (!res.get("content-type")) {
          logger.warn("Response content-type is not defined. Using default: application/json;charset=utf-8");
          res.header("Content-Type", contentType.toString());
        }

        /* Check expected response */
        if (!expectedResponse) {
          commons.handle(ResponseValidationError, `Response ${code} is not defined in the OAS Document for ${req.method} ${req.route.path}`, config.strict);
        } else if (expectedResponse.content) {
          const acceptTypes = req.headers.accept? req.headers.accept.split(",").map((type) => new MIMEtype(type.trim()).essence) : ["*/*"];
          const neededTypes = [contentType.essence, `${contentType.type}/*`, `*/*`];
          if (neededTypes.every((type) => !acceptTypes.includes(type))) {
            commons.handle(ResponseValidationError, 'Response content-type is not accepted by the client', true);
          } else {
            const schemaContentType = Object.keys(expectedResponse.content)[0];
            const schema = schemaUtils.parseSchema(expectedResponse.content[schemaContentType].schema, "response");
            const parsedData = schemaUtils.parseBody(data, schema);
            const {validate, valid} = validator.validate(parsedData, schema, oasFile.openapi);

            if (!valid) {
              commons.handle(ResponseValidationError, `Wrong data in response.\n${validate.errors.map((e) => `- Validation failed at ${e.schemaPath} > ${e.message}`).join("\n")}`, config.strict);
            } 
          }
        } else {
          logger.debug("Response content is not defined in the OAS Document for this response");
        }
        oldSend.call(res, contentType.essence === "application/json" ? JSON.stringify(data) : data);
      }
      next();
    });
  }
    
}
