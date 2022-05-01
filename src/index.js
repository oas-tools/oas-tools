/*
OAS-tools module 0.0.0, built on: 2017-03-30
Copyright (C) 2017 Ignacio Peluaga Lozada (ISA Group)
https://github.com/ignpelloz
https://github.com/isa-group/project-oas-tools
*/

import $RefParser from "@apidevtools/json-schema-ref-parser";
import { logger, schema } from "./utils";
import loadConfig from "./config";
import { OASSwagger, OASRouter, OASParams, OASRequestValidator, OASResponseValidator, OASErrorHandler } from "./middleware";

/**
 * Function to initialize OAS-tools middlewares.
 *@param {object} app - Express server used for the application. Needed to register the paths.
 *@param {function} config - Config object overriding defaults.
 */
export async function initialize(app, config) {

    await loadConfig(config).then(async cfg => {
      logger.configure(cfg.logger);

      if(cfg.useAnnotations) 
        logger.warn("Annotations enabled. This feature is currently experimental and may not work as expected.");

      schema.validate(cfg.oasFile);
      logger.info("Valid specification file");

      const oasFile = await $RefParser.dereference(cfg.oasFile);
      logger.info("Specification file dereferenced");

      _registerNativeMiddleware(app, oasFile, cfg);
      
    }).catch(err => {
      logger.error(err.stack);
      process.exit(1);
    });
}

function _registerNativeMiddleware(app, oasFile, config) {
  const expressOasFile = schema.expressPaths(oasFile);

  /* Params middleware: Register locals */
  OASParams.initialize(expressOasFile, config).register(app);

  if(config.middleware.validator.requestValidation) {
    OASRequestValidator.initialize(expressOasFile, {...config.middleware.validator, endpoints: config.endpointCfg}).register(app);
    logger.info(`Request validator middleware registered`);
  } 
  if(config.middleware.validator.responseValidation) {
    OASResponseValidator.initialize(expressOasFile, {...config.middleware.validator, endpoints: config.endpointCfg}).register(app);
    logger.info(`Response validator middleware registered`);
  }
  if(!config.middleware.router.disable) {
    OASRouter.initialize(expressOasFile, {...config.middleware.router, endpoints: config.endpointCfg}).register(app);
    logger.info(`Router middleware registered`);
  }
  if (/^3\.1\.\d+(-.+)?$/.test(oasFile.openapi)) {
    logger.warn("Swagger UI is not supported for OpenAPI 3.1.x, middleware will be disabled");
  } else if(!config.middleware.swagger.disable){
    OASSwagger.initialize(oasFile, {...config.middleware.swagger, endpoints: config.endpointCfg}).register(app);
    logger.info(`Swagger middleware registered. Swagger UI available at: ${config.middleware.swagger.path}`);
  }
  if(!config.middleware.error.disable) {
    OASErrorHandler.initialize(oasFile, {...config.middleware.error, endpoints: config.endpointCfg}).register(app);
    logger.info(`Error handler middleware registered`);
  }
}