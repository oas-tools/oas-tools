class BaseError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
export class ConfigError extends BaseError {
  constructor(message) {
    super("ConfigError", message);
  }
}

export class UnsupportedError extends BaseError {
  constructor(message) {
    super("UnsupportedError", message);
  }
}

export class ValidationError extends BaseError {
  constructor(message, name = "ValidationError") {
    super(name, message);
  }
}

export class RequestValidationError extends ValidationError {
  constructor(message) {
    super(message, "RequestValidationError");
  }
}

export class ResponseValidationError extends ValidationError {
  constructor(message) {
    super(message, "ResponseValidationError");
  }
}

export class RoutingError extends BaseError {
  constructor(message) {
    super("RoutingError", message);
  }
}

export class SecurityError extends BaseError {
  constructor(message) {
    super("SecurityError", message);
  }
}

/* Not used natively, given as an utility 
 * class that may be imported externally */
export class AuthError extends BaseError {
  constructor(message) {
    super("AuthError", message);
  }
}