import { logger, errors } from "@oas-tools/commons";
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
    logger.warn("This initialization is deprecated and will be removed in the future. Please read the docs.");
    cfg.oasFile = findOASDoc('.', oasDoc);

    const paramCompatibility = (req,res,next) => {
        const path = req.route.path.replace(/:.+?(?=\/|$)/g, (m) => `{${m.substring(1)}}`);
        const operation = oasDoc.paths[path][req.method.toLowerCase()];
        const requestBody = operation.requestBody;
        const contentType = Object.keys(requestBody?.content ?? {})[0];

        req.swagger = {
            params: {
                ...requestBody ? {[requestBody?.["x-name"] ?? "body"]: {
                    path: path,
                    schema: requestBody?.content[contentType]?.schema,
                    originalValue: req.body,
                    value: req.body,
                    ...req.files?.length > 0 ? {files: req.files} : {}
                }} : {}
            },
            operation: operation,
        };

        Object.entries(res.locals.oas.params ?? {}).forEach(([paramName, paramValue]) => {
            const schema = operation.parameters.find((param) => param.name === paramName);
            req.swagger.params[paramName] = {
                path,
                schema,
                originalValue: req[schema.in === "query" ? "query" : "params"]?.[paramName],
                value: paramValue
            }
        });
        next();
    }
    
    use(paramCompatibility, {}, 1);

    Promise.all(
        Object.entries(cfg.middleware?.security?.auth ?? {}).map(async ([secName, handler]) => {
            if (typeof handler === "object") {
                const newHandler = await import("../../auth/handlers/index.js");
                cfg.middleware.security.auth[secName] = newHandler.bearerJwt({...handler, secret: handler.key});
            }
        })
    ).then(async () => {
        if (cfg.authCfg) {
            const authMiddleware = (await import('../../auth/middleware/index.js')).OASBearerJWT;
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
            logFile: Boolean(config.logfile),
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
    if (Object.values(cfg.middleware.security.auth).some((handler) => typeof handler === "object")) {
        try {
            require.resolve('../../auth/handlers');
        } catch(err) {
            throw new errors.ConfigError('Auth middleware is required for using JWT handlers based on config. Please install @oas-tools/auth package.')
        }
    }
    if (config.oasAuth) {
        try {
            require.resolve('../../auth/middleware');
            cfg.authCfg = config.grantsFile ?? {};
        } catch(err) {
            throw new errors.ConfigError('Auth middleware is enabled. Please install @oas-tools/auth package.')
        }
    }
}

function findOASDoc(path, oasDocContent) {
    if ((/\w+\.(?:yaml|json)$/).test(path)){
        let fileStr = readFileSync(path, 'utf-8');
        fileStr = (/\w+\.json$/).test(path) ? fileStr : JSON.stringify(jsyaml.load(fileStr))
        if (fileStr === JSON.stringify(oasDocContent)) return path
    } else {
        try {
            if (!(/\w+\.\w+$/).test(path)){
                const dirs = readdirSync(path).filter((fileDir) => !['node_modules'].includes(fileDir) && !(/^\..*$/).test(fileDir))
                for (const dir of dirs) {
                    return findOASDoc(`${path}/${dir}`, oasDocContent);
                }
            }
        } catch (err) {
            logger.warn(`Ignored ${path} when searching for OASDoc location. Could't read file or directory`)
        }
    }
}
