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
    if (Object.keys(secSchemes).some(key => !handlers[key])) {
      throw new ConfigError("Missing handlers for some of the security schemes declared in OAS Document.");
    }
    if (handlers && Object.values(handlers).some(handler => typeof handler !== 'function')) {
      throw new ConfigError("Security handlers must be functions.");
    }

    /* Instanciate middleware */
    return new OASSecurity(oasFile, async (req, res, next) => {
      const oasRequest = oasFile.paths[req.route.path][req.method.toLowerCase()];
      if (oasFile.security || oasRequest.security) {
        const secReqs = oasRequest.security ?? oasFile.security;
        /* Logical OR */
        await Promise.any(secReqs.map(async secReq => {
          /* Logical AND */
          Object.entries(secReq).forEach(([secName, secScope]) => {
            const secDef = secSchemes[secName];
            let token;
            if (!secDef) {
              throw new ConfigError(`Security scheme '${secName}' not found in OAS Document.`);
            }
            switch (secDef.type) {
              case 'http':
                token = req.headers.authorization; break;
              case 'apiKey':
                if (secDef.in === 'header') {
                  token = req.headers[secDef.name.toLowerCase()];
                } else if (secDef.in === 'query') {
                  token = req.query[secDef.name];
                } else {
                  token = req.headers.cookie?.split(';').find(c => c.trim().startsWith(`${secDef.name}=`))?.split('=')[1];
                } break;
              case 'oauth2':
                throw new UnsupportedError(`oauth2 security schemes are not supported yet.`);
              default:
                throw new UnsupportedError(`Security scheme ${secName} is invalid or not supported.`);
            }
            if (!token) throw new SecurityError(`Missing token for security scheme ${secName}.`);
            handlers[secName](token, (status) => res.status(status));
          });
        })).catch(err => {
          if (err instanceof AggregateError) {
            next(err.errors[0]);
          }
        });
      } else {
        logger.debug('No security defined for this request, skipping security middleware.');
      }
      next();
    });
  
  }
}