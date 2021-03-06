import { NextFunction, Request, Response } from 'express';
import { Task } from '../interfaces/tasks.interface';
import { decodeToken } from '../services/auth.service';
import taskService from '../services/tasks.service';
import { TokenPayloadData } from '../interfaces/auth.interface';

class TasksController {
  public taskService = new taskService();

  public getTasks = async (req: Request, res: Response, next: NextFunction) => {
    const jwtToken = req.cookies.Authorization;
    const tokenData: TokenPayloadData = decodeToken(jwtToken);
    const userUUID = tokenData.uuid;

    if (req.params.today) {
      const findAllTasksData: Task[] = await this.taskService.findNextTasks(userUUID);
      res.status(200).json({ data: findAllTasksData, message: 'findToday' });
    } else {
      try {
        const findAllTasksData: Task[] = await this.taskService.findAllTasks(userUUID);
        res.status(200).json({ data: findAllTasksData, message: 'findAll' });
      } catch (error) {
        next(error);
      }
    }
  };

  public getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.params.id;
    const jwtToken = req.cookies.Authorization;
    const tokenData: TokenPayloadData = decodeToken(jwtToken);
    const userUUID = tokenData.uuid;

    try {
      const findOneTaskData: Task = await this.taskService.findTaskById(taskId);
      res.status(200).json({ data: findOneTaskData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createTask = async (req: Request, res: Response, next: NextFunction) => {
    const taskData: Task = req.body;
    const jwtToken = req.cookies.Authorization;
    const tokenData: TokenPayloadData = decodeToken(jwtToken);
    const userId = tokenData.uuid;

    try {
      const createTaskData: Task = await this.taskService.createTask(userId, taskData);
      res.status(201).json({ data: createTaskData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateTask = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.params.id;
    const taskData: Task = req.body;
    const jwtToken = req.cookies.Authorization;
    const tokenData: TokenPayloadData = decodeToken(jwtToken);
    const userUUID = tokenData.uuid;
    
    try {
      const updatedTaskData: Task = await this.taskService.updateTask(userUUID, taskId, taskData);
      res.status(200).json({ data: updatedTaskData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTaskById = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.params.id;
    const jwtToken = req.cookies.Authorization;
    const tokenData: TokenPayloadData = decodeToken(jwtToken);
    const userUUID = tokenData.uuid;

    try {
      const deletedTaskData: Task = await this.taskService.deleteTaskById(userUUID, taskId);
      res.status(200).json({ data: deletedTaskData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public deferTasks = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.params.id;
    const jwtToken = req.cookies.Authorization;
    const tokenData: TokenPayloadData = decodeToken(jwtToken);
    const userUUID = tokenData.uuid;

    try {
      const deferredTask: Task = await this.taskService.deferTask(userUUID, taskId, req.body.deferredUntilDt);
      res.status(200).json({ data: deferredTask, message: 'deferred' });
    } catch (error) {
      next(error);
    }
  };
  
  public completeTask = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.params.id;
    const jwtToken = req.cookies.Authorization;
    const tokenData: TokenPayloadData = decodeToken(jwtToken);
    const userUUID = tokenData.uuid;

    try {
      const deferredTask: Task = await this.taskService.completeTask(userUUID, taskId);
      res.status(200).json({ data: deferredTask, message: 'deferred' });
    } catch (error) {
      next(error);
    }
  };
}

export default TasksController;
