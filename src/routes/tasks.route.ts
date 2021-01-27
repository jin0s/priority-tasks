import { validate } from 'class-validator';
import { Router } from 'express';
import TasksController from '../controllers/tasks.controller';
import { TaskDto } from '../dtos/tasks.dto';
import Route from '../interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';

class TasksRoute implements Route {
  public path = '/tasks';
  public router = Router();
  public tasksController = new TasksController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:today?`, authMiddleware, this.tasksController.getTasks);
    this.router.get(`${this.path}/:id`, authMiddleware, this.tasksController.getTaskById);
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(TaskDto), this.tasksController.updateTask);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.tasksController.deleteTaskById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(TaskDto), this.tasksController.createTask);
  }
}

export default TasksRoute;
