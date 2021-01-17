import { Router } from 'express';
import TasksController from '../controllers/tasks.controller';
import { TaskDto } from '../dtos/tasks.dto';
import Route from '../interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';

class TasksRoute implements Route {
  public path = '/tasks';
  public router = Router();
  public tasksController = new TasksController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, this.tasksController.getTaskById);
    this.router.post(`${this.path}`, this.tasksController.createTask);
  }
}

export default TasksRoute;
