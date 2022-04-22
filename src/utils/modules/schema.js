import jsyaml from "js-yaml";
import fs from "fs";
import _ from 'lodash';
import path from "path";
import Ajv2020 from "ajv/dist/2020";
import Ajv04 from "ajv-draft-04";
import addFormats from "ajv-formats";
import { logger } from "./logger";
import { ValidationError } from "./errors";

/**
 * Validates the oasFile against the openApi schema
 * @param {string} oasFilePath - Path to the spec file.
 */
export function validate(oasFilePath) {
  if (!fs.existsSync(oasFilePath)) {
    throw new ValidationError(`Specification file at ${oasFilePath} not found`);
  }
  const oasFile = jsyaml.safeLoad(fs.readFileSync(oasFilePath, "utf8"));
  const version = oasFile.openapi;
  let ajv;
  let schema;

  switch(true) {
    case /^3\.0\.\d(-.+)?$/.test(version):
      ajv = new Ajv04({strict: false, logger: logger});
      schema = JSON.parse(fs.readFileSync(path.join(__dirname, "../../schemas/openapi-3.0.json"), "utf8")); break;
    case /^3\.1\.\d+(-.+)?$/.test(version):
      ajv = new Ajv2020({strict: false, logger: logger});
      schema = JSON.parse(fs.readFileSync(path.join(__dirname, "../../schemas/openapi-3.1.json"), "utf8")); break;
    default:
      throw new ValidationError(`Unsupported OpenAPI version: ${version}. Supported versions are 3.0.X, 3.1.X`);
  }

  addFormats(ajv);
  const validate = ajv.compile(schema);
  const valid = validate(oasFile);
  if (!valid) {
    throw new ValidationError(`Specification file does not meet OpenAPI ${version} schema.\n Failed > ${validate.errors.map(e => e.message).join("\n Failed > ")}`);
  }
}

/**
 * Modifies OAS paths to match the format expected by express middlewares.
 * @param {string} oasFile - OpenApi Specification file.
 */
export function expressPaths(oasFile) {
  const oasFileExpress = _.cloneDeep(oasFile);
  Object.entries(oasFile.paths).filter(path => /{[\S]*}/g.test(path)).forEach(([path, obj]) => {
    let expressPath = path.replace(/{/g, ":").replace(/}/g, "");
    oasFileExpress.paths[expressPath] = obj;
    delete oasFileExpress.paths[path];
  });
  return oasFileExpress;
}

export function fixNullable(schema) {
  Object.getOwnPropertyNames(schema).forEach((property) => {
    if (
      property === "type" &&
      schema.nullable === true &&
      schema.type !== "null" &&
      !Array.isArray(schema.type) &&
      schema.type.indexOf("null") === -1
    ) {
      schema.type = [schema.type, "null"];
    } else if (
      typeof schema[property] === "object" &&
      schema[property] !== null
    ) {
      fixNullable(schema[property]);
    }
  });
}


