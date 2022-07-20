import { logger, errors } from "oas-devtools/utils";
import { createRequire } from 'node:module';
import { initialize as init, use} from "./index.js";
import jsyaml from 'js-yaml'
import { readdirSync, readFileSync } from 'fs';
export { use };

let cfg = {};
const require = createRequire(import.meta.url);

/**
 * Function to initialize OAS-tools middlewares.
 *@param {function} oasDoc - Open Api Specification document
 *@param {object} app - Express server used for the application. Needed to register the paths.
 *@param {function} callback - Callback function
 *@deprecated
 */
export function initialize(oasDoc, app, callback) {
    logger.warn("Compatibility functions try to adapt older functionality to the new versions of OAS-Tools. Bear in mind that it may not work as expected.");
    cfg.oasFile = findOASDoc('.', oasDoc);

    use(function compatibilityMiddleware(req,res,next) { req.oas = res.locals.oas; next() }, {}, 1);

    Promise.all(
        Object.entries(cfg.middleware.security.auth).map(async ([secName, handler]) => {
            if (typeof handler === "object") {
                let newHandler = await import("oas-auth/handlers");
                cfg.middleware.security.auth[secName] = newHandler.bearerJwt({...handler, secret: handler.key});
            }
        })
    ).then(async () => {
        if (cfg.authCfg) {
            let authMiddleware = (await import('oas-auth/middleware')).OASBearerJWT;
            use(authMiddleware, {acl: cfg.authCfg}, 3);
        }
        await init(app, cfg);
    }).then(() => {
        callback()
    });
}

/**
 * Function to configure OAS-tools.
 *@param {object} config - System configuration.
 *@deprecated
 */
export function configure(config) {
    cfg = {
        logger: {
            customLogger: config.customLogger,
            level: config.loglevel,
            logFile: config.logfile ? true : false,
            logFilePath: config.logfile
        },
        middleware: {
            router: {
                disable: !(config.router ?? true),
                controllers: config.controllers
            },
            validator: {
                requestValidation: config.validator ?? true,
                responseValidation: config.validator ?? true,
                strict: config.strict
            },
            security: {
                disable: !(config.oasSecurity ?? false),
                auth: config.securityFile ?? {}
            },
            swagger: {
                path: config.docs?.swaggerUiPrefix ? `${config.docs?.swaggerUiPrefix}${config.docs?.swaggerUi}` : config.docs?.swaggerUi
            }
        }
    }
    if (config.oasAuth) {
        try {
            require.resolve('oas-auth/middleware')
            cfg.authCfg = config.grantsFile ?? {};
        } catch(err) {
            throw new errors.ConfigError('Auth middleware is enabled. Please install oas-auth package.')
        }
    }
}

function findOASDoc(path, oasDocContent) {
    if (/\w+\.(?:yaml|json)$/.test(path)){
        let fileStr  = readFileSync(path, 'utf-8');
        fileStr = /\w+\.json$/.test(path) ? fileStr : JSON.stringify(jsyaml.safeLoad(fileStr))
        if (fileStr === JSON.stringify(oasDocContent)) return path
    } else {
        try {
            if (!/\w+\.\w+$/.test(path)){
                const dirs = readdirSync(path).filter(fileDir => !['node_modules', '.oas-generator'].includes(fileDir))
                for (let dir of dirs) {
                    return findOASDoc(`${path}/${dir}`, oasDocContent);
                }
            }
        } catch (err) {
            logger.warn(`Ignored ${path} when searching for OASDoc location. Could't read file or directory`)
        }
    }
}