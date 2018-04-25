var fs = require('fs'),
  path = require('path');

var jsyaml = require('js-yaml');

var converter = require('swagger2openapi');
var options = {
  sourceYaml: true,
  yaml: true
};

var spec = fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8'); //this one works
//var swagger = jsyaml.safeLoad(spec);

//options.patch = true; // fix up small errors in the source definition
//options.warnOnly = true; // Do not throw on non-patchable errors
converter.convertObj(spec, options, function(err, options) {
  console.log(options.openapi);
});
// also available are asynchronous convertFile, convertUrl, convertStr and convertStream functions
// if you omit the callback parameter, you will instead receive a Promise
