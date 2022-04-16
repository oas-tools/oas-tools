/*
OAS-tools module 0.0.0, built on: 2017-03-30
Copyright (C) 2017 Ignacio Peluaga Lozada (ISA Group)
https://github.com/ignpelloz
https://github.com/isa-group/project-oas-tools
*/

import $RefParser from "@apidevtools/json-schema-ref-parser";
import { logger, schema } from "./utils";
import loadConfig from "./config";

/**
 * Function to initialize OAS-tools middlewares.
 *@param {object} app - Express server used for the application. Needed to register the paths.
 *@param {function} config - Config object overriding defaults.
 */
export async function initialize(app, config) {

    await loadConfig(config).then(async cfg => { 
      logger.configure(cfg.logger);

      schema.validate(cfg.oasDoc);
      logger.info("Valid specification file");

      const oasDoc = await $RefParser.dereference(cfg.oasDoc);
      logger.info("Specification file dereferenced");
      
    }).catch(err => {
      logger.error(err.stack);
      process.exit(1);
    });
}
