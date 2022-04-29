import * as validator from "validator";
import { logger } from "./logger"
/**
 * Generates a valid name, according to value of nameFor.
 * @param {string} input - String to generate a name from.
 * @param {string} nameFor - possible values are controller, function, variable.
 */
export function generateName(input, nameFor) {
    var chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789.";
    var name = validator.whitelist(input, chars);
    switch (nameFor) {
      case "controller":
        name += "Controller";
        break;
      case "function":
        name = "func" + name;
        break;
      case "variable":
        name = "var" + name;
        break;
      case undefined: //'nameFor' is undefined: just normalize
        break;
    }
    return name;
}

/**
 * @param {String} path - OAS formatted path.
 */
export function expressPath(path){
  return path.replace(/{/g, ':').replace(/}/g, '');
}

/**
 * @param {Array} arr1 - Source array
 * @param {Array} arr2 - Array to be substracted from source array.
 */
export function arrayDiff(arr1, arr2) {
  return arr1.filter(x => !arr2.includes(x));
}

/**
 * @param {Class} errorClass - Error class to be thrown.
 * @param {String} message - Message to be thrown.
 * @param {Boolean} strict - If true, throw error, else log warning.
 */
export function handle(errorClass, message, strict = false) {
  if (strict) throw new errorClass(message);
  else logger.warn(message);
}