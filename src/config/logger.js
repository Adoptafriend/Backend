/* eslint-disable consistent-return */
import winston from 'winston';
import morgan from 'morgan';
// eslint-disable-next-line import/no-unresolved
import chalk from 'chalk';

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  sql: 5,
  test: 6,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const chalkColors = {
  error: { text: chalk.red, bg: chalk.bgRed },
  warn: { text: chalk.yellow, bg: chalk.bgYellow },
  info: { text: chalk.green, bg: chalk.bgGray },
  http: { text: chalk.magenta, bg: chalk.bgMagenta },
  debug: { text: chalk.white, bg: chalk.bgBlue },
  sql: { text: chalk.white, bg: chalk.bgBlue },
  test: { text: chalk.white, bg: chalk.bgBlue },
};

const filter = filterLevel =>
  format(info => {
    if (!filterLevel) return info;
    if (info.level === filterLevel) {
      return info;
    }
  })();

const createFormat = filterLevel =>
  combine(
    filter(filterLevel),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    printf(info => {
      const colorText = chalkColors[info.level].text;
      const colorBg = chalkColors[info.level].bg;
      const log = `${info.timestamp} ${colorText.bold(
        info.level.toUpperCase()
      )}: ${colorBg(info.message)}`;
      return log;
    })
  );

const logTransports = [
  new transports.File({
    filename: './logs/error.log',
    level: 'error',
    format: createFormat(),
  }),
  new transports.File({
    filename: './logs/combined.log',
    level: 'info',
    format: createFormat(),
  }),
  new transports.File({
    filename: './logs/http.log',
    level: 'http',
    format: createFormat('http'),
  }),
  new transports.Console({
    level: 'http',
    format: createFormat(),
  }),
  new transports.Console({
    level: 'debug',
    format: format.combine(filter('debug'), format.prettyPrint()),
  }),
  new transports.File({
    filename: './logs/sql.log',
    level: 'sql',
    format: format.combine(filter('sql'), format.prettyPrint()),
  }),
  new transports.File({
    filename: './logs/test.log',
    level: 'test',
    format: format.combine(filter('test'), format.prettyPrint()),
  }),
];

const logger = createLogger({
  level: level(),
  levels,
  transports: logTransports,
});

export const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    skip: (req, res) => res.statusCode < 400,
    stream: {
      write: message => logger.http(message),
    },
  }
);

export default logger;
