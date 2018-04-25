#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var path = require('path');
var jsyaml = require('js-yaml');
var ZSchema = require('z-schema');
var validator = new ZSchema({
  ignoreUnresolvableReferences: true
});
var config = require('../src/configurations'),
  logger = config.logger;
var shell = require('shelljs');
var zipFolder = require('zip-folder');
var touch = require("touch");

var schemaV3 = fs.readFileSync(path.join(__dirname, './schemas/openapi-3.0.json'), 'utf8');
schemaV3 = JSON.parse(schemaV3);

program
  .arguments('<file>')
  .action(function(file) {
    try {
      var spec = fs.readFileSync(path.join(__dirname, file), 'utf8');
      var oasDoc = jsyaml.safeLoad(spec);
      logger.info('Input oas-doc %s: %s', file, oasDoc);
      validator.validate(oasDoc, schemaV3, function(err, valid) {
        if (err) {
          logger.error('oasDoc is not valid: ' + JSON.stringify(err));
          process.exit();
        } else {

          shell.exec('mkdir nodejs-server-generated');
          shell.cd('nodejs-server-generated');

          shell.exec('mkdir .oas-codegen && echo 3.0.0 > .oas-codegen/VERSION'); //touch /.swagger-codegen/VERSION

          shell.exec('mkdir api');
          shell.cp('../' + file, './api/swagger.yaml');

          shell.exec('mkdir controllers');
          touch.sync('controllers/Pet.js');

          shell.exec('mkdir service');
          touch.sync('service/PetsService.js');

          shell.exec('mkdir utils');
          touch.sync('utils/writer.js');

          touch.sync('.swagger-codegen-ignore');
          touch.sync('index.js');
          touch.sync('package.json'); //use this or 'npm init'
          touch.sync('README.md');

          shell.exec('npm install');

          zipFolder('/nodejs-server-generated', '../nodejs-server-generated.zip', function(err) {
            if (err) {
              console.log('oh no!', err);
            } else {
              console.log('EXCELLENT');
              shell.rm('-rf', '../nodejs-server-generated');
            }
          });

        }
      });
    } catch (err) {
      logger.error(err);
    }
  })
  .parse(process.argv);
