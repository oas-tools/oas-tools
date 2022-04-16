import * as validator from "validator";

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