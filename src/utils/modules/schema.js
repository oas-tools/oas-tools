import _ from 'lodash';

/**
 * Modifies OAS paths to match the format expected by express middlewares.
 * @param {string} oasFile - OpenApi Specification file.
 */
export function expressPaths(oasFile) {
  const oasFileExpress = _.cloneDeep(oasFile);
  Object.entries(oasFile.paths).filter((path) => (/{[\S]*}/g).test(path)).forEach(([path, obj]) => {
    const expressPath = path.replace(/{/g, ":").replace(/}/g, "");
    oasFileExpress.paths[expressPath] = obj;
    delete oasFileExpress.paths[path];
  });
  return oasFileExpress;
}

/**
 * Parse the request body taking defaults into account
 * @param {string} body - Request body.
 * @param {string} schema - OAS schema declaration for request body.
 */
export function parseBody(body, schema) {
  const bodyType = Array.isArray(body) ? 'array' : typeof body;

  if (bodyType === 'array' && schema.type === "array") {
      const newBody = body ?? [];
      return newBody.map((item) => parseBody(item, schema.items));
  } else if ((bodyType === 'object' || bodyType === "undefined") && schema.type === "object") {
      const newBody = body ?? {};

      // Parse properties
      Object.keys(schema.properties ?? {}).map((field) =>
        newBody[field] = parseBody(newBody[field], schema.properties[field])
      );

      // Parse additionalProperties
      if (schema.additionalProperties) {
        Object.keys(newBody)
          .filter((field) => !Object.keys(schema.properties ?? {}).includes(field))
          .map((field) => newBody[field] = parseBody(newBody[field], schema.additionalProperties));
      }

    if (!body && !Object.keys(newBody).some((key) => newBody[key])) {
      return body;
    }

      return _.omitBy(newBody, _.isUndefined);

  } else if (_.isUndefined(body)) {
      return body ?? schema.default;
  } else {
      return body ?? (schema.default ?? null);
  }
}

/**
 * Parse schemas depending on the scope
 * @param {string} schema - OAS Schema declaration.
 * @param {string} scope - Scope, can be `request` or `response`.
 */
 export function parseSchema(schema, scope) {
  const newSchema = JSON.parse(JSON.stringify(schema));

  if (schema.oneOf || schema.anyOf || schema.allOf) {
    const keyword = Object.keys(schema)[0];
    newSchema[keyword] = schema[keyword].map((sch) => parseSchema(sch, scope));
  } else if (schema.not) {
    newSchema.not = parseSchema(schema.not, scope);
  } else if (schema.type === "array") {
      newSchema.items = parseSchema(schema.items, scope);
  } else if (schema.type === "object") {

      Object.keys(schema.properties ?? {}).forEach((prop) => {
        const requiredIdx = schema.required?.indexOf(prop);

        if (scope === "request" && requiredIdx > -1 && schema.properties[prop].readOnly) {
          newSchema.required.splice(requiredIdx, 1);
        } else if (scope === "response" && requiredIdx > -1 && schema.properties[prop].writeOnly) {
          newSchema.required.splice(requiredIdx, 1);
        }
        newSchema.properties[prop] = parseSchema(newSchema.properties[prop], scope);
      });
  }
  return _.omitBy(newSchema, (i) => Array.isArray(i) && i.length === 0);
}


