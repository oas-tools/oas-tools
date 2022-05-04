import { OASBase } from "./oas-base";
import { logger, errors } from "../../utils";
import _ from "lodash";

const { SecurityError, UnsupportedError, ConfigError } = errors;

export class OASSecurity extends OASBase {
  constructor(oasFile, middleware) {
    super(oasFile, middleware);
  }

  static initialize(oasFile, config) {
    const handlers = config.auth;
    const secSchemes = oasFile.components.securitySchemes;

    /* Initial checks */
    if (!handlers && secSchemes) {
      throw new ConfigError("No security handlers defined in config for security schemes.");
    }
    if (Object.keys(handlers).some(key => !secSchemes[key])) {
      throw new ConfigError("Missing handlers for some of the security schemes declared in OAS Document.");
    }
    if (handlers && Object.values(handlers).some(handler => typeof handler !== 'function')) {
      throw new ConfigError("Security handlers must be functions.");
    }

    /* Instanciate middleware */
    return new OASSecurity(oasFile, (req, res, next) => {
      const oasRequest = oasFile.paths[req.route.path][req.method.toLowerCase()];
      if (oasFile.security || oasRequest.security) {
        const secReqs = oasRequest.security ?? oasFile.security;
        secReqs.flatMap(i => Object.entries(i)).forEach(([secName, secScopes]) => {
          const secDef = secSchemes[secName];
          let token;
          if (!secDef) {
            throw new ConfigError(`Security scheme '${secName}' not found in OAS Document.`);
          }
          switch (secDef.type) {
            case 'http':
              token = req.headers.authorization; break;
            case 'apiKey':
            case 'oauth2':
              throw new UnsupportedError(`apiKey and oauth2 security schemes are not supported yet.`);
            default:
              throw new UnsupportedError(`Security scheme ${secName} is invalid or not supported.`);
          }
          if (!token) throw new SecurityError(`Missing token for security scheme ${secName}.`);
          handlers[secName](token, (status) => res.status(status));
        });
      } else {
        logger.debug('No security defined for this request, skipping security middleware.');
      }
      next();
    });
  
  }
}