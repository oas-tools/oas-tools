import { OASBase, errors, logger } from "@oas-tools/commons";

export class OASErrorHandler extends OASBase {
  constructor(oasFile, middleware) {
    super(oasFile, middleware);
  }

  static initialize(oasFile, config) {
    if (config.customHandler && typeof config.customHandler !== "function") {
      throw new errors.ConfigError("Custom error handler must be a function");
    } else if (config.customHandler && config.customHandler.length !== 2) {
      throw new errors.ConfigError(
        "Custom error handler must take 2 arguments (err, send)"
      );
    }
    return new OASErrorHandler(oasFile, (err, _req, res, next) => {

      /* Resets send behaviour */
      if (res.defaultSend) {
        res.send = res.defaultSend;
      }

      if (res.headersSent) {
        return next(err);
      }

      /* Handler function */
      let responseBody;
      const sendErr = (code, body) => {
        responseBody = body ?? { error: `${err.name}: ${err.message}` };
        res.status(code);
      }

      /* Handle errors */
      if (err.name === "RequestValidationError") {
        if ((/[\S\s]* content-type is not accepted [\S\s]*/).test(err.message)) {
          sendErr(406);
        } else {
          sendErr(400);
        }
      } else if (err.name === "SecurityError") {
        sendErr(401);
      } else if (err.name === "AuthError") {
        sendErr(403);
      } else if (config.customHandler) {
        config.customHandler(err, sendErr);
      }

      /* Catch unhandled errors */
      if (!responseBody) {
        sendErr(500);
      }

      /* Log and send to client */
      logger.error(config.printStackTrace ? err.stack : `${err.name}: ${err.message}`);
      res.send(responseBody);
    });
  }

  register(app) {
    app.use(super.getMiddleware());
  }
}
