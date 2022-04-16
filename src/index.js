/*
OAS-tools module 0.0.0, built on: 2017-03-30
Copyright (C) 2017 Ignacio Peluaga Lozada (ISA Group)
https://github.com/ignpelloz
https://github.com/isa-group/project-oas-tools
*/

import $RefParser from "@apidevtools/json-schema-ref-parser";
import { logger, schema } from "./utils";
import loadConfig from "./config";
import { OASSwagger } from "./middleware";

/**
 * Function to initialize OAS-tools middlewares.
 *@param {object} app - Express server used for the application. Needed to register the paths.
 *@param {function} config - Config object overriding defaults.
 */
export async function initialize(app, config) {

    await loadConfig(config).then(async cfg => { 
      logger.configure(cfg.logger);

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
  if(!config.middleware.swagger.disable){
    OASSwagger.initialize(config, oasFile).register(config.middleware.swagger.path, '*', app);
    logger.info(`Swagger middleware registered. Swagger UI available at: ${config.middleware.swagger.path}`);
  }
}
