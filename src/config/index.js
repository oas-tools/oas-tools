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

import fs from "fs";
import jsyaml from "js-yaml";
import path from "path";
import _ from "lodash";
import rc from "rc";

export default async(config_object) => {
  return await _loadDefaults().then(defaults => {
    const packageJSON = JSON.parse(fs.readFileSync(config_object?.packageJSON || defaults.packageJSON, "utf8"));
    const oastoolsrc = _.omit(rc('oastools', _.assign( {}, defaults)), ['config', 'configs', '_']);
    return _.merge(defaults, packageJSON['oas-tools'], oastoolsrc, config_object);
  })
}

async function _loadDefaults(){
  let defaultString = fs.readFileSync(path.join(__dirname, "defaults.yaml"), "utf8");
  let defaults = jsyaml.safeLoad(defaultString);
  defaults.controllers = path.join(process.cwd(), 'controllers');
  defaults.packageJSON = path.join(process.cwd(), 'package.json');
  defaults.oasDoc = path.join(process.cwd(), 'api/oas-doc.yaml');
  return defaults;
}