class BaseError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class ValidationError extends BaseError {
  constructor(message) {
    super("ValidationError", message);
  }
}

export class RoutingError extends BaseError {
  constructor(message) {
    super("RoutingError", message);
  }
}