# oas-tools

Middlewares to use on NodeJS applications working with OpenAPI Specification (v3) and.

The folder oas-tools inside /src contains the project as a npm module, ready to be placed inside node_modules and used.

## 1. Install oas-tools
```bash
npm install oas-tools -g
```

## 1. Use oas-tools

Require the installed module in your app index file, just like:

```javascript
var oasTools = require('oas-tools');
```

The module oas-tools requires the specification file of the NodeJS application, therefore load it as follow using fs and jsyaml:

```javascript
var jsyaml = require('js-yaml');
var fs = require('fs');

var spec = fs.readFileSync(path.join('path/to/spec/file'), 'utf8');
var oasDoc = jsyaml.safeLoad(spec);
```

[Note: you might want to use the module ‘path’ for loading the specification file, that way your app will work on any OS]


It is also possible to set configuration variables, these are them:

Name	Type	Explanation / Values
logLevel	-	Values for config file are: Debug, info, error. For hardcoded object these values must be converted to numbers_ Debug = , info = , error = . Default is info.
logFile	String	Path to logs file.
controllers	String	Path to location of controllers.
strict	Boolean	Indicates whether validation must stop the request process if errors were found when validating according to specification file. True by default.
router	Boolean	Indicates whether router middleware should be used. True by default.
valdator	Boolean	Indicates whether validator middleware should be used. True by default.
ignoreUnknownFormats	Boolean	Indicates whether z-schema validator must ignore unknown formats when validating requests and responses. True by default.


For setting these variables you can use the function configure and pass to it either a JavaScript object or a yaml/json file containing such object.

```javascript
var options_object = {
  controllers: '/path/to/controllers',
  loglevel: 13,
  logfile: '/path/to/logs/file',
  strict: true,
  router: true,
  validator: true,
  ignoreUnknownFormats: true
};

oasTools.configure(options_object);
```

[Note: it is not mandatory to set all configuration variables when using this functions, oas-tools will set the other ones by default]


Finally for initializing the middlewares right before your app is up and running, the function ‘initialize’ must be used. It receives the specification file, the express server object and a callback function where you must start your server:


### 1.1. Migrate from swagger-tools to oas-tools

Oas-tools works with express while swagger-tools works with Connect, therefore in order to use your swagger-codegen generated NodeJS server with oas-tools you have to leave connect behind and use express and an openapi version 3 file. This can be easily achievable by following just 4 simple steps:

1.	Change from connect to express:

Oas-tools needs express module to work, connect doesn’t have the needed features.
Therefore you must install express:

$ npm install express -g

Then change the require on your app’s index file, get rid of connect!




2.	Require oas-tools instead of swagger-tools:

Then you have to change from swagger to the great oas-tool by just modifying the require:




3.	Convert your specification file from version 2 to version 3:

As you may know oas-tools works only with the version 3 of the specification, therefore you should update you specification file.
Use the tool provided at https://mermade.org.uk/openapi-converter to do so. Once you get the translation simply copy-past it to you former specification file.


4.	Pass express server object to initialize method:

Finally you must do is to give the server object to oas-tools. It needs it to manage routes the right way. Just place it as a second parameter for the initializeMiddleware function.



Once you have done all this, leave the rest the way it is and just run your appliaction with ‘node index.js’ or any other command you have specified at your package.json for running the application.




## Latest release

[![Build Status](https://travis-ci.org/isa-group/project-template-nodejs.svg?branch=master)](https://travis-ci.org/http://github.com/isa-group/project-template-nodejs)

The version 0.0.0 is the latest stable version of oas-tools component.
see [release note](http://github.com/isa-group/oas-tools/releases/tag/0.0.0) for details.

For running:

- Download latest version from [0.0.0](http://github.com/isa-group/oas-tools/releases/tag/0.0.0)
## Copyright notice

**OAS-tools module** is open-source software available under the GNU General Public License (GPL) version 3 (GPL v3).

All including documentation and code are copyrighted and the copyright is owned by [ISA Group](http://www.isa.us.es),
[University of Sevilla](http://www.us.es), unauthorized reproduction or distribution of this copyrighted work is illegal.
For commercial licensing terms, please [contact](./extra/contact.md) for any inquiry.

For technical inquiry please contact to [engineering team](./extra/about.md).

## Latest release

[![Build Status](https://travis-ci.org/https://github.com/isa-group/oas-tools.svg?branch=master)](https://travis-ci.org/https://github.com/isa-group/oas-tools)

The version 0.0.0 is the latest stable version of OAS-tools module component.
see [release note](https://github.com/isa-group/oas-tools/releases/tag/0.0.0) for details.

For running:

- Download latest version from [0.0.0](https://github.com/isa-group/oas-tools/releases/tag/0.0.0)
