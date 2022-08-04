import { errors } from '@oas-tools/commons'

export function getRequest(req, res, next) {
  switch(res.locals.oas.params.error) {
    case "badRequest":
      throw new errors.RequestValidationError("Bad Request");
    case "security":
      throw new errors.SecurityError("Security Error");
    case "auth":
      throw new errors.AuthError("Auth Error");
    case "notAccepted":
      throw new errors.RequestValidationError("Response content-type is not accepted by the client");
    case "responseValidation":
      throw new errors.ResponseValidationError("Handled by custom handler");
    default:
      throw new Error("Unkown error");
  }
};