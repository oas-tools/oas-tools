'use strict';

var _ = require('lodash-compat');
var async = require('async');
var jwt = require('jsonwebtoken');
var config = require('../configurations'),
    logger = config.logger;

var getValue = (req, secDef, secName, secReq) => {
    var propName = secDef.name;
    var propLocation = secDef.in;
    var value;

    if (secDef.type === 'oauth2') {
        value = secReq[secName];
    } else if (secDef.type === 'http') {
        if (secDef.scheme === 'bearer') {
            value = req.headers.authorization;
        }
    } else if (secDef.type === 'apiKey') {
        if (propLocation === 'query') {
            value = req.query;
        } else if (propLocation === 'header') {
            value = req.headers[propName.toLowerCase()];
        }
    }

    return value;
};
var sendSecurityError = (err, res, next) => {
    // Populate default values if not present
    if (!err.code) {
        err.code = 'server_error';
    }

    if (!err.statusCode) {
        err.statusCode = 403;
    }

    if (err.headers) {
        _.each(err.headers, (header, name) => {
            res.setHeader(name, header);
        });
    }

    res.statusCode = err.statusCode;
    next(err);
};

function removeBasePath(reqRoutePath) {
    return reqRoutePath.split('').filter((a, i) => {
        return a !== config.basePath[i];
    })
        .join('');
}

function verifyToken(req, secDef, token, secName, next) { // eslint-disable-line
    const bearerRegex = /^Bearer\s/;

    function sendError(statusCode) {
        return req.res.sendStatus(statusCode);
    }

    if (token && bearerRegex.test(token)) {
        var newToken = token.replace(bearerRegex, '');
        jwt.verify(
            newToken, config.securityFile[secName].key,
            {
                algorithms: config.securityFile[secName].algorithms || ['HS256'],
                issuer: config.securityFile[secName].issuer
            },
            (error, decoded) => {
                if (error === null && decoded) {
                    return next();
                }
                return next(sendError(403));
            }
        );
    } else {
        return next(sendError(401));
    }
}

module.exports = (specDoc) => {

    return function OASSecurity(req, res, next) {
        var handlers = config.securityFile;
        var operation = config.pathsDict[removeBasePath(req.route.path)];
        var securityReqs;

        if (operation) {
            logger.debug('Checking security...');
            securityReqs = specDoc.paths[operation][req.method.toLowerCase()].security || specDoc.security;

            if (securityReqs && securityReqs.length > 0) {
                async.mapSeries(securityReqs, (secReq, callback) => { // logical OR - any one can allow
                    var secName;

                    async.map(Object.keys(secReq), (name, callback) => { // logical AND - all must allow
                        var secDef = specDoc.components.securitySchemes[name];
                        var handler = handlers[name];

                        secName = name;

                        if (!handler || !_.isFunction(handler)) {
                            if (secDef.type === 'http' && secDef.scheme === 'bearer' && secDef.bearerFormat === 'JWT') {
                                return verifyToken(req, secDef, req.headers.authorization, name, callback);
                            }
                            return callback(new Error('No handler was specified for security scheme ' + name));
                        }

                        return handler(req, secDef, getValue(req, secDef, name, secReq), callback);
                    }, (err) => {
                        logger.debug('    Security check ' + secName + ': ' + (_.isNull(err) ? 'allowed' : 'denied'));

                        // swap normal err and result to short-circuit the logical OR
                        if (err) {
                            return callback(undefined, err);
                        }

                        return callback(new Error('OK'));
                    });
                }, (ok, errors) => { // note swapped results
                    var allowed = !_.isNull(ok) && ok.message === 'OK';

                    logger.debug('    Request allowed: ' + allowed);

                    if (allowed) {
                        return next();
                    }

                    return sendSecurityError(errors[0], res, next);
                });
            } else {
                return next();
            }
        } else {
            return next();
        }
    };
};

exports = module.exports;
