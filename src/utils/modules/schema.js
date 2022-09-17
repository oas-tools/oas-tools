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
 * @param {string} schema - OAS schema definition for request body.
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
      
      return _.omitBy(newBody, _.isNil);
  } else {
    return body ?? schema.default;
  } 
}

