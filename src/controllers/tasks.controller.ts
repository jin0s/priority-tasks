import { NextFunction, Request, Response } from 'express';
import { TaskDto } from '../dtos/tasks.dto';
import { Task } from '../interfaces/tasks.interface';
import taskService from '../services/tasks.service';

class TasksController {
  public taskService = new taskService();

  public getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.params.id;

    try {
      const findOneTaskData: Task = await this.taskService.findTaskById(taskId);
      res.status(200).json({ data: findOneTaskData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createTask = async (req: Request, res: Response, next: NextFunction) => {
    const taskData: TaskDto = req.body;

    try {
      const createTaskData: Task = await this.taskService.createTask(taskData);
      res.status(201).json({ data: createTaskData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}

export default TasksController;
