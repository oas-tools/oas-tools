'use strict';

var _ = require('lodash');
var async = require('async');
var qs = require('qs');
var parseurl = require('parseurl');
var config = require('../configurations'),
    logger = config.logger;

function parseQueryString(req) {
    return req.url.indexOf('?') > -1 ? qs.parse(parseurl(req).query, {}) : {};
}

var getScopeOrAPIKey = (req, secDef, secName, secReq) => {
    var apiKeyPropName = secDef.name;
    var apiKeyLocation = secDef.in;
    var scopeOrKey;

    if (secDef.type === 'oauth2') {
        scopeOrKey = secReq[secName];
    } else if (secDef.type === 'http') {
        if (secDef.scheme === 'bearer') {
            scopeOrKey = req.headers.authorization;
        }
    } else if (secDef.type === 'apiKey') {
        if (apiKeyLocation === 'query') {
            scopeOrKey = (req.query ? req.query : parseQueryString(req))[apiKeyPropName];
        } else if (apiKeyLocation === 'header') {
            scopeOrKey = req.headers[apiKeyPropName.toLowerCase()];
        }
    }

    return scopeOrKey;
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

/**
 * Middleware for using Swagger security information to authenticate requests.
 *
 * This middleware also requires that you use the swagger-metadata middleware before this middleware. It is recommended
 * that this middleware is included before swagger-validator and swagger-router. This makes no attempt to work around
 * invalid Swagger documents.
 *
 *
 * A SecurityImplementation is essentially middleware must include 2 exported methods:
 *   configure (SecurityDefinition)
 *   authorize (request, response, SecurityRequirement)
 *
 * @param {object} [options] - The middleware options
 *                 [options.{name}={handler}] - the keys match SecurityDefinition names and the associated values are
 *                                              functions that accept the following parameters: (request,
 *                                              securityDefinition, scopes, callback) where callback accepts one
 *                                              argument - an Error if unauthorized. The Error may include "message",
 *                                              "state", and "code" fields to be conveyed to the client in the response
 *                                              body and a "headers" field containing an object representing headers
 *                                              to be set on the response to the client. In addition, if the Error has
 *                                              a statusCode field, the response statusCode will be set to match -
 *                                              otherwise, the statusCode will be set to 403.
 *
 * @returns the middleware function
 */
exports = module.exports = (options, specDoc) => { //eslint-disable-line
    var handlers = options || {};

    logger.debug('Initializing swagger-security middleware');
    logger.debug('  Security handlers:%s', Object.keys(handlers).length > 0 ? '' : ' ' + Object.keys(handlers).length);

    _.each(options, (func, name) => {
        logger.debug('    %s', name);
    });

    return function swaggerSecurity(req, res, next) { //eslint-disable-line
        var operation = config.pathsDict[removeBasePath(req.route.path)];
        var securityReqs;

        logger.debug('%s %s', req.method, req.url);
        logger.debug('  Will process: %s', _.isUndefined(operation) ? 'no' : 'yes');

        if (operation) {
            securityReqs = specDoc.paths[operation].security || specDoc.security;

            if (securityReqs && securityReqs.length > 0) {
                async.mapSeries(securityReqs, (secReq, cb) => { // logical OR - any one can allow
                    var secName;

                    async.map(Object.keys(secReq), (name, cb) => { // logical AND - all must allow
                        var secDef = specDoc.components.securitySchemes[name];
                        var handler = handlers[name];

                        secName = name;

                        if (!handler) {
                            return cb(new Error('unknown security handler: ' + name));
                        }

                        return handler(req, secDef, getScopeOrAPIKey(req, secDef, name, secReq), cb);
                    }, (err) => {
                        logger.debug('    Security check (%s): %s', secName, _.isNull(err) ? 'allowed' : 'denied');

                        // swap normal err and result to short-circuit the logical OR
                        if (err) {
                            return cb(undefined, err);
                        }

                        return cb(new Error('OK'));
                    });
                }, (ok, errors) => { // note swapped results
                    var allowed = !_.isNull(ok) && ok.message === 'OK';

                    logger.debug('    Request allowed: %s', allowed);

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
