import { OASBase, errors, logger } from "@oas-tools/commons";

const { SecurityError, UnsupportedError, ConfigError } = errors;

export class OASSecurity extends OASBase {
  constructor(oasFile, middleware) {
    super(oasFile, middleware);
  }

  static initialize(oasFile, config) {
    const handlers = config.auth;
    const secSchemes = oasFile.components.securitySchemes;

    /* Initial checks */
    if (!secSchemes) {
      throw new ConfigError("No security schemes defined in the OAS Document.");
    }
    if (!handlers) {
      throw new ConfigError("No security handlers defined in config for security schemes.");
    }
    if (Object.keys(secSchemes).some((key) => !handlers[key])) {
      throw new ConfigError("Missing handlers for some of the security schemes declared in OAS Document.");
    }
    if (handlers && Object.values(handlers).some((handler) => typeof handler !== 'function')) {
      throw new ConfigError("Security handlers must be functions.");
    }

    // Check there are not multiple http schemes for the same operation
    const secByOp = Object.values(oasFile.paths).flatMap((opObj) => Object.values(opObj)).map((op) => op.security ?? oasFile.security).filter((o) => o);
    const multipleHttp = secByOp.filter((scheme) => scheme.flatMap((obj) => Object.keys(obj)).filter((k) => secSchemes[k]?.type === "http").length > 1).length;

    if(multipleHttp > 0) {
      throw new ConfigError("Operations must not have more than one Security Scheme of type 'http'");
    }
    
    /* Instanciate middleware */
    return new OASSecurity(oasFile, async (req, res, next) => {
      const oasRequest = oasFile.paths[req.route.path][req.method.toLowerCase()];
      if (oasFile.security || oasRequest.security) {
        const secReqs = oasRequest.security ?? oasFile.security;

        /* Logical OR */
        await Promise.any(secReqs.map((secReq) => {

          /* Logical AND */
          return Promise.all(Object.entries(secReq).map(async ([secName, secScope]) => {
            const secDef = secSchemes[secName];
            let token;
            if (!secDef) {
              throw new ConfigError(`Security scheme '${secName}' not found in OAS Document.`);
            }
            switch (secDef.type) {
              case 'http':
                token = req.headers.authorization;
                break;
              case 'apiKey':
                if (secDef.in === 'header') {
                  token = req.headers[secDef.name.toLowerCase()];
                } else if (secDef.in === 'query') {
                  token = req.query[secDef.name];
                } else {
                  token = req.headers.cookie?.split(';').find((c) => c.trim().startsWith(`${secDef.name}=`))?.split('=')[1];
                } 
                break;
              case 'oauth2':
              case 'openIdConnect':
                return [secName, await handlers[secName](secDef, secScope)]; 
              default:
                throw new UnsupportedError(`Security scheme ${secName} is invalid or not supported.`);
            }
            if (['http', 'apiKey'].includes(secDef.type)) {
              if (!token) throw new SecurityError(`Missing token for security scheme ${secName}.`);              
              return [secName, await handlers[secName](token)];
            }
          })).then((results) => {
            results.forEach(([secName, result]) => {
              if (result) res.locals.oas.security = {[secName]: result};
            })
          });
        })).catch((err) => {
          if (err instanceof AggregateError) {
            if (!err.errors.every((e) => e instanceof SecurityError)) {
              next(err.errors.filter((e) => !(e instanceof SecurityError))[0]);
            } else if (err.errors.length >= secReqs.length) {
              next(err.errors[0]);
            }
          }
        });
      } else {
        logger.debug('No security defined for this request, skipping security middleware.');
      }
      next();
    });
  
  }
}
