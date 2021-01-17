import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import logger from 'morgan';
import Routes from './interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';
import sequelize from './models/index.model';

class App {
  public app: express.Application;
  public port: string | number;
  public envIsDevelopment: boolean;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.envIsDevelopment = process.env.NODE_ENV === 'development' ? true : false;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 App listening at\nhttp://localhost:${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    if (this.envIsDevelopment) {
      this.app.use(logger('dev'));
      this.app.use(cors({ origin: true, credentials: true }));
    } else {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(logger('combined'));
      this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
    }
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private connectToDatabase() {
    sequelize.sync({ force: false });
  }
}

export default App;
