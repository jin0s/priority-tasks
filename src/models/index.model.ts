import { Sequelize } from 'sequelize-typescript';
import Task from './tasks.model';
import User from './users.model';

let sequelize: Sequelize;
if (process.env.NODE_ENV === 'development') {
  sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    protocol: 'postgres',
    logging: console.log,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    timezone: '-05:00',
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
    pool: {
      min: 0,
      max: 30,
      idle: 10000,
      acquire: 30000,
    },
  });
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    protocol: 'postgres',
    logging: false,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    timezone: '-05:00',
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
    pool: {
      min: 0,
      max: 30,
      idle: 10000,
      acquire: 30000,
    },
  });
}

sequelize.addModels([User]);
sequelize.addModels([Task]);

sequelize.authenticate().catch((err: Error) => {
  console.error('Unable to connect to the database:', err);
});

export default sequelize;
