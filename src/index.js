/*
OAS-tools module 0.0.0, built on: 2017-03-30
Copyright (C) 2017 Ignacio Peluaga Lozada (ISA Group)
https://github.com/ignpelloz
https://github.com/isa-group/project-oas-tools
*/

import { OASBase, logger, validateOASFile } from "@oas-tools/commons";
import { OASErrorHandler, OASParams, OASRequestValidator, OASResponseValidator, OASRouter, OASSecurity, OASSwagger } from "./middleware/index.js";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import loadConfig from "./config/index.js";
import { schema } from "./utils/index.js";

const middlewareChain = [ 
  OASParams, 
  OASSecurity, 
  OASRequestValidator, 
  OASResponseValidator, 
  OASRouter, 
  OASSwagger,
  OASErrorHandler
];

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
      
      validateOASFile(cfg.oasFile);
      logger.info("Valid specification file");

      const oasFile = await $RefParser.dereference(cfg.oasFile);
      logger.info("Specification file dereferenced");

      /* Initialize native & external middleware */
      const finalChain = await _initMiddleware(oasFile, cfg).then((chain) => chain.filter((m) => m!==null));

      /* Register middleware in express */
      Object.keys(oasFile.paths ?? {}).forEach((path) => {
        finalChain.forEach((middleware) => {
          middleware.register(app, path.replace(/{/g, ':').replace(/}/g, ''));
          const name = middleware.constructor.name;
          logger.info(`Registered ${name === 'OASBase' ? name + '[' + middleware.getMiddleware().name + ']' : name} middleware`);
        })
      });
    }).catch((err) => {
      logger.error(err.stack);
      process.exit(1);
    });
}

/**
 * Load external modules into the middleware chain.
 *@param {class | function} npmModule - class extending OASBase, or the middleware function itself.
 *@param {object} options - Config object.
 *@param {integer} priority - Position of the chain in which the module will be inserted.
 */
export function use(npmModule, options, priority) {
    middlewareChain.splice(priority ?? 3, 0, {mod: npmModule, options: options ?? {}})
}

/* Map native middlewares to {mod, options} object 
and initialize native and external middleware */
async function _initMiddleware(oasFile, config) {
  const expressOasFile = schema.expressPaths(oasFile);
  return Promise.all(middlewareChain.map(async (middleware) => {
    let initObj;
    if (middleware.name === "OASParams") {
      initObj = { mod: middleware, options: config }
    } else if (middleware.name === "OASSecurity") {
      initObj = { mod: middleware, options: {...config.middleware.security, endpoints: config.endpointCfg}}
    } else if (middleware.name === "OASRequestValidator") {
      initObj = { mod: middleware, options: {...config.middleware.validator, disable: !config.middleware.validator.requestValidation, endpoints: config.endpointCfg}}
    } else if (middleware.name === "OASResponseValidator") {
      initObj = { mod: middleware, options: {...config.middleware.validator, disable: !config.middleware.validator.responseValidation, endpoints: config.endpointCfg}}
    } else if (middleware.name === "OASRouter") {
      initObj = { mod: middleware, options: {...config.middleware.router, endpoints: config.endpointCfg}}
    } else if (middleware.name === "OASSwagger") {
      initObj = { mod: middleware, options: {...config.middleware.swagger, endpoints: config.endpointCfg, file: oasFile}}
    } else if (middleware.name === "OASErrorHandler") {
      initObj = { mod: middleware, options: {...config.middleware.error, endpoints: config.endpointCfg, file: oasFile}}
    } else { // external middleware
      initObj = {mod: await Promise.resolve(middleware.mod), options: {...middleware.options, endpoints: config.endpointCfg}};
    }

    let res;
    if (initObj.options.disable) {
      res = null
    } else if (typeof initObj.mod.initialize === "function") {
      res = await initObj.mod.initialize(initObj.options.file ?? expressOasFile, initObj.options);
      logger.debug(`${initObj.mod.name} middleware initialized`);
    } else if (typeof initObj.mod === "function" && initObj.mod.length >= 3) {
      res = new OASBase(expressOasFile, initObj.mod);
      logger.debug(`External middleware "${initObj.mod.name}" initialized`);
    } else {
      throw new TypeError("External modules must be a middleware functions or classes extending OASBase");
    }
    return res;
  }));
}
