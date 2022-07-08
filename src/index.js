/*
OAS-tools module 0.0.0, built on: 2017-03-30
Copyright (C) 2017 Ignacio Peluaga Lozada (ISA Group)
https://github.com/ignpelloz
https://github.com/isa-group/project-oas-tools
*/

import { OASBase, OASErrorHandler } from "oas-devtools/middleware";
import { OASParams, OASRequestValidator, OASResponseValidator, OASRouter, OASSecurity, OASSwagger } from "./middleware";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import loadConfig from "./config";
import { logger } from "oas-devtools/utils";
import { schema } from "./utils";

/**
 * Function to initialize OAS-tools middlewares.
 *@param {object} app - Express server used for the application. Needed to register the paths.
 *@param {function} config - Config object overriding defaults.
 */
export async function initialize(app, config) {

    await loadConfig(config).then(async (cfg) => {
      logger.configure(cfg.logger);

      if(cfg.useAnnotations) 
        logger.warn("Annotations enabled. This feature is currently experimental and may not work as expected.");
      
      schema.validate(cfg.oasFile);
      logger.info("Valid specification file");

      const oasFile = await $RefParser.dereference(cfg.oasFile);
      logger.info("Specification file dereferenced");

      /* Initialize native & external middleware */
      const nativeChain = await _initNativeMiddleware(oasFile, cfg);
      const middlewareChain = await _initExternalMiddleware(oasFile, cfg, nativeChain);

      /* Register middleware in express */
      middlewareChain.forEach((middleware) => {
        middleware.register(app);
        const name = middleware.constructor.name;
        logger.info(`Registered ${name === 'OASBase' ? name + '[' + middleware.name + ']' : name} middleware`);
      })
    }).catch((err) => {
      logger.error(err.stack);
      process.exit(1);
    });
}

async function _initNativeMiddleware(oasFile, config) {
  const expressOasFile = schema.expressPaths(oasFile);
  const middlewareChain = [];

  /* Params middleware: Register locals */
  middlewareChain.push(OASParams.initialize(expressOasFile, config));

  if(!config.middleware.security.disable) {
    middlewareChain.push(OASSecurity.initialize(expressOasFile, {...config.middleware.security, endpoints: config.endpointCfg}));
    logger.debug(`Security middleware initialized`);
  }
  if(config.middleware.validator.requestValidation) {
    middlewareChain.push(OASRequestValidator.initialize(expressOasFile, {...config.middleware.validator, endpoints: config.endpointCfg}));
    logger.debug(`Request validator middleware initialized`);
  } 
  if(config.middleware.validator.responseValidation) {
    middlewareChain.push(OASResponseValidator.initialize(expressOasFile, {...config.middleware.validator, endpoints: config.endpointCfg}));
    logger.debug(`Response validator middleware initialized`);
  }
  if(!config.middleware.router.disable) {
    const middleware = await OASRouter.initialize(expressOasFile, {...config.middleware.router, endpoints: config.endpointCfg});
    middlewareChain.push(middleware);
    logger.debug(`Router middleware initialized`);
  }
  if((/^3\.1\.\d+(-.+)?$/).test(oasFile.openapi)) {
    logger.warn("Swagger UI is not supported for OpenAPI 3.1.x, middleware will be disabled");
  } else if(!config.middleware.swagger.disable){
    middlewareChain.push(OASSwagger.initialize(oasFile, {...config.middleware.swagger, endpoints: config.endpointCfg}));
    logger.debug(`Swagger middleware initialized. Swagger UI will be available at: ${config.middleware.swagger.path}`);
  }
  if(!config.middleware.error.disable) {
    middlewareChain.push(OASErrorHandler.initialize(oasFile, {...config.middleware.error, endpoints: config.endpointCfg}));
    logger.debug(`Error handler middleware initialized`);
  }

  return middlewareChain;
}

async function _initExternalMiddleware(oasFile, config, nativeChain) {
  const expressOasFile = schema.expressPaths(oasFile);
  const middlewareChain = [...nativeChain];

  if (!Array.isArray(config.middleware.external)) {
    throw new TypeError("config.middleware.external must be an array");
  } else {
    await Promise.all(config.middleware.external.flatMap((mod) => {
      const tmp = {};

      /* Get the import name and configs */
      if (typeof mod === "object") { 
        if (Array.isArray(mod)) { // module library
          const [module, submodules] = mod;
          Object.entries(submodules).filter(([key, value]) => key !== 'priority' && value).forEach(([key, value]) => {
            tmp[`${module.split('/').at(-1)}/${key}`] = {...value, priority: value.priority ?? submodules.priority};
          });
        } else { // module with options
          const [name, options] = Object.entries(mod)[0];
          tmp[name.split('/').at(-1)] = options;
        }
      } else { // module with no options
        tmp[mod.split('/').at(-1)] = {};
      }

      /* Import and initialize the middleware */
      return Object.entries(tmp).map(async ([name, options]) => {
        const importedObj = await import(name);
        return await Promise.all(Object.values(importedObj).map(async (imported) => {
          if (typeof imported === "function" && imported.length >= 3) {
            return {middleware: new OASBase(expressOasFile, imported), priority: options.priority ?? 3};
          } else if (Object.getPrototypeOf(imported).constructor === OASBase.constructor) {
            return {middleware: await imported.initialize(expressOasFile, {...options, endpoints: config.endpointCfg}), priority: options.priority ?? 3};
          } else {
            throw new TypeError(`${name} must be a middleware function or a class extending OASBase`);
          }
        }));
      });
    })).then((middleware) => {
      middleware.flat().sort((a,b) => a.priority - b.priority).forEach(({middleware, priority}) => {
        middlewareChain.splice(priority, 0, middleware);
      });
    });
    return middlewareChain;
  }
}
