/*!
OAS-tools module 0.0.0, built on: 2017-03-30
Copyright (C) 2017 Ignacio Peluaga Lozada (ISA Group)
https://github.com/ignpelloz
https://github.com/isa-group/project-oas-tools

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.*/

import _ from "lodash";
import { fileURLToPath } from "url";
import fs from "fs";
import jsyaml from "js-yaml";
import { logger } from "@oas-tools/commons";
import path from "path";
import rc from "rc";
import readline from "readline";

export default async(config_object) => {
  const defaults = _loadDefaults();
  const packageJSON = JSON.parse(fs.readFileSync(config_object?.packageJSON || defaults.packageJSON, "utf8"));
  const oastoolsrc = _.omit(rc('oastools', _.assign({}, defaults)), ['config', 'configs', '_']);
  const config = _.merge(defaults, packageJSON['oas-tools'], oastoolsrc, config_object);
  if (config.useAnnotations)
    config.endpointCfg = await _readJsDoc(config.middleware.router.controllers);
  return config;
}

/** Loads default configurations
 * @returns {object} default configs*/
function _loadDefaults(){
  const __filename = fileURLToPath(import.meta.url);
  const defaultString = fs.readFileSync(path.join(path.dirname(__filename), 'defaults.yaml'), "utf8");
  const defaults = jsyaml.load(defaultString);
  defaults.middleware.router.controllers = path.join(process.cwd(), 'controllers');
  defaults.packageJSON = path.join(process.cwd(), 'package.json');
  defaults.oasFile = path.join(process.cwd(), 'api/oas-file.yaml');
  return defaults;
}

/** Reads files containing oas-tools endpoints configs expressed as JSDoc annotations.
 * @param {string} path - Directory containing oas-tools JsDoc annotated files.*/
async function _readJsDoc(path) {
  const res = {};

  /* Reads files in parallel */
  await Promise.all(fs.readdirSync(path).map(async (file) => {
    let controller, endCycle, isController, jsdoc;
    let tmp = {};
    const rl = readline.createInterface({input: fs.createReadStream(`${path}/${file}`)});
    
    /* Read and check each line of the file */
    for await (const line of rl) {
      isController = isController || line && (/@oastools {Controller} [\S]+/).test(line);
      if (isController) {

        /* Get the function name annotated with jsdoc and build its config*/
        if (endCycle && Object.entries(tmp).length > 0) {
          tmp.exportName = [...line.matchAll(/export(?:s\.| [\w]+ )([\w]+)/g)].flat()[1];
          tmp.exportPath = `${path}/${file}`;
          const endpoint = `${controller}${tmp.path || ''}`;
          if(!res[endpoint]) res[endpoint] = [];
          res[endpoint].push(tmp);
          endCycle = false;
          tmp = {};
        } 

        /* Captures jsDoc expression */
        if ((/\/\*\*/).test(line)) 
          jsdoc = true;

        /* Captures every @oastools annotation properly formatted */
        if (jsdoc && (/@oastools {[\S]+} [\S]+/).test(line)){
          const [_result, key, val] = [...line.matchAll(/@oastools {([\S]+)} ([\S]+)/g)].flat();
          if(key === 'Controller') controller = val;
          else tmp[key] = val;
        } 

        /* Captures the end of jsDoc expression */
        if ((/\*\//).test(line)){ 
          jsdoc = false;
          endCycle = !(/@oastools {Controller} [\S]+/).test(line);
        } 
      } else if (line) {
        if ((/@oastools/).test(fs.readFileSync(`${path}/${file}`, "utf8").toString())) 
          logger.warn(`${file} has been ignored: file does not contain a valid controller annotation.`);
        break;
      }    
    }
  }));
  return res;
}
