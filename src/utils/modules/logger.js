import winston from "winston";
const colorizer = winston.format.colorize();

const defaults = {
  format : winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:MM:SS'}),
    winston.format.label({label: 'oas-tools'}),
    winston.format.printf(({timestamp, label, level, message}) => 
      [colorizer.colorize('date', timestamp),
      colorizer.colorize('label', `[${label}]`),
      colorizer.colorize(level, `${level.toUpperCase()}:`),
      message].join(' ')
      ),
    ),
  levels: {error: 7, warn: 8, info: 9, debug: 10},
  colors: {error: "bold red", warn: "bold yellow", info: "bold blue", debug: "bold green", date: "italic gray", label: "bold cyan"}
}

class Logger {
  config;
  #logger;

  constructor() {
    winston.addColors(defaults.colors);
    this.config = {
      levels : defaults.levels,
      exitOnError : false,
      transports: [new winston.transports.Console({
        level: 'info', 
        handleExceptions: true, 
        json: false, 
        format: defaults.format
      })]
    }
    this.#logger = winston.createLogger(this.config);
  }

  configure(conf) {
    if (conf.customLogger) {
      this.#logger = conf.customLogger;
    } else {
      this.config.transports[0].level = conf.level
      if(conf.logFile){
        this.config.transports = [
          ...this.config.transports,
          new winston.transports.File({
            level: conf.level,
            filename: conf.logFilePath,
            handleExceptions: true,
            maxsize: 5242880, //5MB
            format: winston.format.combine(
              winston.format.timestamp({format: 'YYYY-MM-DD HH:MM:SS'}),
              winston.format.label({label: 'oas-tools'}),
              winston.format.printf(({timestamp, label, level, message}) => `${timestamp} [${label}] ${level}: ${message}`),
              )
          })
        ]
      }
      this.#logger = winston.createLogger(this.config)
    }
  }
  debug(message){
    this.#logger.debug(message)
  }
  info(message) {
    this.#logger.info(message)
  }
  log(message) {
    this.info(message)
  }
  warn(message){
    this.#logger.warn(message)
  }
  error(message){
    this.#logger.error(message)
  }
}

export const logger = new Logger();