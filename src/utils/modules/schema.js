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


