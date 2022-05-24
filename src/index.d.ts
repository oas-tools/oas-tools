import { Application, Request, Response, NextFunction } from 'express';

enum LogLevels {
    Error = 7, // Defining starting point to the enum
    Warn,
    Custom,
    Info,
    Debug
}
  
enum Colors {
    Error = "red",
    Warn = "yellow",
    Custom = "magenta",
    Info = "white",
    Debug = "blue"
}
  
interface DocOptions {
    // Route of apiDocs
    apiDocs?: string; // Default value: "/api-docs"
    apiDocsPrefix?: string;
    
    // Route of swaggerUI
    swaggerUi?: string; // Default value: "/docs"
    swaggerUiPrefix?: string;
}
  
declare interface Options {
    loglevel?: LogLevels | string; // Default value: `LogLevels.Info`
    logfile?: string; // Log file path (ignored when using `customLogger` option)
    customLogger?: Object;
    customErrorHandling?: boolean;
    controllers?: string; // Controllers location path (default: `${cwd}/controllers`)
    checkControllers?: boolean; // Default value: true
    strict?: boolean; // Default value: false
    router?: boolean; // Default value: true
    validator?: boolean; // Default value: true
    oasSecurity?: boolean; // Default value: false
    securityFile?: object; // Default value: null
    oasAuth?: boolean; // Default value: false
    grantsFile?: object; // Default value: null
    ignoreUnknownFormats?: boolean; // Default value: true
    docs?: DocOptions;
}
  
interface Middleware {
    swaggerValidator: typeof EmptyMiddleware;
    swaggerRouter: typeof EmptyMiddleware;
    swaggerMetadata: typeof EmptyMiddleware;
    swaggerUi: typeof EmptyMiddleware;
    swaggerSecurity: typeof EmptyMiddleware;
}

declare module 'oas-tools' {
    function configure(options: Options): void;
    function init_checks(specDoc: object, callback: Function): void;
    function initialize(oasDoc: object, app: Application, callback: () => void): void;
    function initializeMiddleware(specDoc: object, app: Application, callback: (middleware: Middleware) => void): void;
}
  
// Should be hidden from the linter
// TODO: Hide those functions from the js/ts linters
function EmptyMiddlewareImp(req: Request, res: Response, next: NextFunction): void;
function EmptyMiddleware(options?: Options): typeof EmptyMiddlewareImp;