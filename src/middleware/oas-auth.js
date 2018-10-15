'use strict';

var config = require('../configurations'),
    logger = config.logger;
var jwt = require('jsonwebtoken');
const AccessControl = require('accesscontrol');
var grantsFile = config.grantsFile;
const ac = new AccessControl(grantsFile);
const AccessControlMiddleware = require('accesscontrol-middleware');
const accessControlMiddleware = new AccessControlMiddleware(ac);

function removeBasePath(reqRoutePath) {
    return reqRoutePath.split('').filter((a, i) => {
        return a !== config.basePath[i];
    })
        .join('');
}

function locationFormat(inProperty) {
    var dict = {
        path: "params",
        query: "query",
        header: "header",
        cookie: "cookie"
    };
    return dict[inProperty];
}

module.exports = (oasDoc) => {

    return function OASAuth(req, res, next) {
        const usedPath = config.pathsDict[removeBasePath(req.route.path)];
        logger.debug('Checking authorization...');
        var securityReqs = oasDoc.paths[usedPath].security || oasDoc.security;

        if (securityReqs && securityReqs.length > 0) {
            var secName;
            var secDef;
            securityReqs.forEach((secReq) => {
                secName = Object.keys(secReq).find((name) => {
                    secDef = oasDoc.components.securitySchemes[name];
                    return secDef.type === 'http' && secDef.scheme === 'bearer' && secDef.bearerFormat === 'JWT';
                });
            });
            if (secName) {
                const method = req.method.toLowerCase();
                var action;
                switch (method) {
                    case 'get':
                        action = 'read';
                        break;
                    case 'post':
                        action = 'create';
                        break;
                    case 'put':
                        action = 'update';
                        break;
                    case 'delete':
                        action = 'delete';
                }
                var paramLocation, usedParameter, userProperty;
                var resource = usedPath;
                var parameters = oasDoc.paths[usedPath][method].parameters;
                const bearerRegex = /^Bearer\s/;
                var token = req.headers.authorization.replace(bearerRegex, '');
                var decoded = jwt.decode(token);
                if (parameters !== undefined) {
                    parameters.forEach((parameter) => {
                        if (parameter['x-aclbinding']) {
                            usedParameter = parameter.name;
                            userProperty = parameter['x-aclbinding'];
                            paramLocation = locationFormat(parameter.in);
                        } else if (!usedParameter && parameter.in === 'path' && decoded[parameter.name]) {
                            usedParameter = parameter.name;
                            userProperty = parameter.name;
                            paramLocation = "params";
                        }
                    })
                }
                var checkObject = {
                    resource: resource,
                    action: action,
                    checkOwnerShip: false,
                };
                if (usedParameter) {
                    checkObject.checkOwnerShip = true;
                    checkObject.operands = [
                        {
                            source: 'user',
                            key: userProperty
                        },
                        {
                            source: paramLocation,
                            key: usedParameter
                        }
                    ];
                }
                if (!req.user) {
                    req.user = {};
                }
                req.user.role = decoded.role || "anonymous";
                req.user[userProperty] = decoded[userProperty] || "";
                var middleware = accessControlMiddleware.check(checkObject);
                middleware(req, res, next);
            } else {
                logger.debug('No security definition including JWT was found');
                return next();
            }
        } else {
            logger.debug('No security requirements found for this request');
            return next();
        }
    }
}

exports = module.exports;
