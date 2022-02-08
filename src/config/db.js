import { Sequelize } from 'sequelize';
import logger from './logger.js';

const env = process.env.NODE_ENV;
let sequelize;
switch (env) {
  case 'production':
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialectOptions: {
        dialect: 'postgres',
        protocol: 'postgres',
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
      define: {
        underscored: true,
        underscoredAll: true,
        freezeTableName: true,
        timestamps: false,
      },
    });
    break;
  case 'test':
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: message => logger.test(message),
      define: {
        underscored: true,
        underscoredAll: true,
        freezeTableName: true,
        timestamps: false,
      },
    });
    break;
  default:
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: 'bin/db.sqlite',
      logging: message => logger.sql(message),
      define: {
        underscored: true,
        underscoredAll: true,
        freezeTableName: true,
        timestamps: false,
      },
    });
}

sequelize
  .authenticate()
  .then(() => {
    if (env !== 'test') {
      logger.log({
        level: 'info',
        message: 'Database connection established successfully',
      });
    }
  })
  .catch(error => {
    logger.log({
      level: 'error',
      message: `Database connection failed: ${error.message}`,
    });
  });

const db = sequelize;

export default db;
